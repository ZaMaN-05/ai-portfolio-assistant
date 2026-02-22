from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

with open("resume_context.txt", "r", encoding="utf-8") as f:
    RESUME_CONTEXT = f.read()


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


@app.post("/chat")
def chat(request: ChatRequest):
    prompt = f"""
You are an AI assistant for Supriyo Bhattacharyya's portfolio website.

RULES:
- Only use the CV information provided below.
- Do not invent research papers, companies, publications, or achievements.
- If information is not present, respond with:
  "This information is not available in the portfolio."
- Keep answers concise, structured, and professional.

CV DATA:
{RESUME_CONTEXT}

User Question:
{request.message}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a factual and precise portfolio assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        },
    )

    data = response.json()

    return {
        "reply": data["choices"][0]["message"]["content"]
    }