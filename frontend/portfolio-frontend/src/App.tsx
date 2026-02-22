import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch(
        "https://ai-portfolio-backend-odtt.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      setReply("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Supriyo Bhattacharyya</h1>

        <p className="subtitle">
          AI Systems • Applied Machine Learning • Security Research
        </p>

        <h2>AI-Powered Portfolio Assistant</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Ask about my projects, internships, skills..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleSubmit}>
            {loading ? "..." : "Submit"}
          </button>
        </div>

        <div className="response-box fade-in">
          {loading ? (
            <p className="loading-text">Generating answer...</p>
          ) : reply ? (
            <p className="reply-text">{reply}</p>
          ) : (
            <p className="placeholder-text">
              The portfolio assistant will respond here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;