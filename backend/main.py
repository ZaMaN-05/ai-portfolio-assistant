from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

with open("resume_context.txt", "r", encoding="utf-8") as f:
    resume_context = f.read()


@app.post("/chat")
async def chat(data: dict):
    user_message = data["message"]

    prompt = f"""
You are an AI assistant for Supriyo Bhattacharyya's portfolio.
Answer ONLY using the resume information below.

RESUME:
{resume_context}

User Question:
{user_message}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "deepseek/deepseek-chat",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    return response.json()