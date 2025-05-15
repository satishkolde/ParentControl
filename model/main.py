import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

HF_TOKEN = os.getenv("HF_TOKEN")  # Replace or use env variable
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# Hugging Face API endpoints
EMOTION_MODEL_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"
TOXICITY_MODEL_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert"
ZSC_MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

# High risk keywords
HIGH_RISK_KEYWORDS = {
    "inappropriate": ["porn", "sex", "xxx", "nsfw", "fuck", "shit", "bitch", "p**n", "s*x", "sexy"],
    "violence": ["kill", "gun", "fight", "shoot", "bomb"],
    "self_harm": ["suicide", "die", "kill myself"]
}

def keyword_check(text):
    text_lower = text.lower()
    for category, keywords in HIGH_RISK_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return None

def query_huggingface(text, model_url, extra_payload=None):
    payload = {"inputs": text}
    if extra_payload:
        payload.update(extra_payload)
    response = requests.post(model_url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()

def get_emotion(text):
    result = query_huggingface(text, EMOTION_MODEL_URL)[0]
    top = max(result, key=lambda x: x["score"])
    return top["label"]

def check_toxicity(text, threshold=0.7):
    result = query_huggingface(text, TOXICITY_MODEL_URL)[0]
    toxic_labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
    return any(r["label"].lower() in toxic_labels and r["score"] > threshold for r in result)

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

    # Check for toxicity
    if check_toxicity(text):
        return "inappropriate"

    # Zero-shot classification
    result = query_huggingface(text, ZSC_MODEL_URL, {"parameters": {"candidate_labels": context_labels}})
    return result["labels"][0]

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
        return "Moderate"

class TextInput(BaseModel):
    text: str

@app.post("/predict")
def predict_all(input_data: TextInput):
    text = input_data.text
    sentiment = get_emotion(text)
    context = classify_context(text)
    risk = classify_risk(sentiment, context)

    return {
        "sentiment": sentiment,
        "context": context,
        "risk": risk,
    }
