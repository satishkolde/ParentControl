import torch
import pickle
from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import BertTokenizer, BertForSequenceClassification

app = FastAPI()

# Load tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Load encoders
with open("ml_model/sentiment_encoder.pkl", "rb") as f:
    sentiment_encoder = pickle.load(f)

with open("ml_model/context_encoder.pkl", "rb") as f:
    context_encoder = pickle.load(f)

with open("ml_model/risk_encoder.pkl", "rb") as f:
    risk_encoder = pickle.load(f)

# Reverse encoders
sentiment_decoder = {v: k for k, v in sentiment_encoder.items()}
context_decoder = {v: k for k, v in context_encoder.items()}
risk_decoder = {v: k for k, v in risk_encoder.items()}

# Load models
sentiment_model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(sentiment_encoder))
sentiment_model.load_state_dict(torch.load("ml_model/sentiment_model.pt", map_location=torch.device("cpu")))
sentiment_model.eval()

context_model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(context_encoder))
context_model.load_state_dict(torch.load("ml_model/context_model.pt", map_location=torch.device("cpu")))
context_model.eval()

risk_model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(risk_encoder))
risk_model.load_state_dict(torch.load("ml_model/risk_model.pt", map_location=torch.device("cpu")))
risk_model.eval()


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
    sentiment = predict(text, sentiment_model, sentiment_decoder)
    context = predict(text, context_model, context_decoder)
    risk = predict(text, risk_model, risk_decoder)

    return {
        "sentiment": sentiment,
        "context": context,
        "risk": risk
    }
