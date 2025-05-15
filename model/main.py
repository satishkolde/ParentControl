import torch
import pickle
from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import BertTokenizer, pipeline

app = FastAPI()

# Load tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

# 1. Keyword filter for high-risk terms (you can expand this list)
HIGH_RISK_KEYWORDS = {
    "inappropriate": ["porn", "sex", "xxx", "nsfw", "fuck", "shit", "bitch","p**n","s*x","sexy"],
    "violence": ["kill", "gun", "fight", "shoot", "bomb"],
    "self_harm": ["suicide", "die", "kill myself"]
}

def keyword_check(text):
    text_lower = text.lower()
    for category, keywords in HIGH_RISK_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return None

# 2. Toxicity model (pretrained)
toxicity_classifier = pipeline("text-classification", model="unitary/toxic-bert", top_k=None)
# Initialize zero-shot classification pipeline
context_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def check_toxicity(text, threshold=0.7):
    results = toxicity_classifier(text)[0]
    # Check if any toxicity label is above threshold (e.g. "toxic", "severe_toxic", etc)
    toxic_labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
    for res in results:
        if res['label'].lower() in toxic_labels and res['score'] > threshold:
            return True
    return False

# 3. Context classifier (zero-shot as fallback)
from transformers import pipeline

context_labels = [
    "education", "entertainment", "social", "searching", "inappropriate",
    "violence", "self_harm", "shopping", "health",
    "relationship", "religion", "politics"
]

def classify_context(text):
    # Check keywords first
    kw_result = keyword_check(text)
    if kw_result:
        return kw_result

    # Then check toxicity to override with inappropriate category if toxic
    if check_toxicity(text):
        return "inappropriate"

    # Finally do zero-shot classification
    result = context_classifier(text, candidate_labels=context_labels)
    return result['labels'][0]  # top predicted label

def classify_risk(sentiment: str, context: str) -> str:
    high_risk = {
        "anger": ["violence", "inappropriate", "self_harm", "politics"],
        "disgust": ["religion", "inappropriate", "health", "self_harm"],
        "fear": ["self_harm", "violence", "health", "relationship"],
        "sadness": ["self_harm", "relationship", "health"]
    }

    moderate_risk = {
        "anger": ["education", "entertainment", "social"],
        "disgust": ["education", "entertainment", "social"],
        "neutral": ["politics", "religion", "relationship", "health"],
        "surprise": ["politics", "religion", "searching"]
    }

    low_risk = {
        "joy": ["education", "entertainment", "social", "shopping"],
        "neutral": ["education", "entertainment", "searching"],
        "surprise": ["education", "entertainment"]
    }

    sentiment = sentiment.lower()
    context = context.lower()

    if sentiment in high_risk and context in high_risk[sentiment]:
        return "High"
    elif sentiment in moderate_risk and context in moderate_risk[sentiment]:
        return "Moderate"
    elif sentiment in low_risk and context in low_risk[sentiment]:
        return "Low"
    else:
        return "Moderate"  # Default to moderate if not clearly defined


# Input: Example text from user
class TextInput(BaseModel):
    text: str


def predict(text, model, decoder):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()
    return decoder[prediction]


@app.post("/predict")
def predict_all(input_data: TextInput):
    text = input_data.text
    # Get emotion predictions
    emotions = emotion_classifier(text)

    # Find the emotion with the highest score
    sentiment = max(emotions[0], key=lambda x: x['score'])
    context = classify_context(text)
    risk = classify_risk(sentiment["label"],context)

    return {
        "sentiment": sentiment["label"],
        "context": context,
        "risk": risk,
    }
