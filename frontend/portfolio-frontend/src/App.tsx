import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    try {
      setLoading(true);
      setReply("");

      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message,
      });

      setReply(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setReply("Connection issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1C1C1A",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(194,109,63,0.08) 0%, transparent 60%)",
        color: "#F3EFEA",
        fontFamily: "'Georgia', serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          border: "1px solid #C26D3F",
          padding: "60px",
          background: "#242422",
          boxShadow: "0 0 0 1px rgba(194,109,63,0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "46px",
            fontWeight: 400,
            marginBottom: "12px",
            letterSpacing: "1px",
          }}
        >
          Supriyo Bhattacharyya
        </h1>

        <p
          style={{
            color: "#D9C7B8",
            marginBottom: "40px",
            fontSize: "14px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI Systems • Applied Machine Learning • Security Research
        </p>

        <div style={{ marginBottom: "20px" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about my research, projects, experience..."
            style={{
              width: "70%",
              padding: "14px",
              background: "#1C1C1A",
              border: "1px solid #C26D3F",
              color: "#F3EFEA",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "14px 22px",
              marginLeft: "10px",
              background: loading ? "#7a5a4a" : "#C26D3F",
              border: "none",
              color: "#1C1C1A",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "1px",
              transition: "0.2s ease",
            }}
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "30px",
            borderLeft: "3px solid #C26D3F",
            background: "#1C1C1A",
            fontSize: "15px",
            lineHeight: "1.8",
            minHeight: "120px",
            transition: "opacity 0.2s ease",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading && !reply && (
            <span style={{ color: "#D9C7B8" }}>
              Generating response, please wait...
            </span>
          )}

          {!loading && reply && <ReactMarkdown>{reply}</ReactMarkdown>}

          {!loading && !reply && (
            <span style={{ color: "#D9C7B8" }}>
              The portfolio assistant will respond here.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;