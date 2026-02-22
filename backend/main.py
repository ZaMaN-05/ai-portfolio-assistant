from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend (Vercel) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/mistral-7b-instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional AI portfolio assistant answering about Supriyo Bhattacharyya. Structure answers cleanly."
                    },
                    {
                        "role": "user",
                        "content": request.message
                    }
                ],
            },
        )

        data = response.json()

        # If OpenRouter returns error
        if "error" in data:
            return {"reply": f"API Error: {data['error']}"}

        reply = data["choices"][0]["message"]["content"]

        return {"reply": reply}

    except Exception as e:
        return {"reply": f"Server Error: {str(e)}"}