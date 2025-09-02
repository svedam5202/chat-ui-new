import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!message && !file) return;

    setChat((prev) => [...prev, { sender: "You", text: message }]);

    const formData = new FormData();
    formData.append("message", message);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8700/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setChat((prev) => [...prev, { sender: "Bot", text: data.response }]);
      setMessage("");
      setFile(null);
      loadHistory();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8700/history");
      const historyData = await res.json();
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  return (
    <div className="container" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: "20%",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRight: "10px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h2 align={"center"}>History</h2>
        <ul>
          {history.map((item, i) => (
            <li
              key={i}
              style={{ cursor: "pointer", marginBottom: "0.5rem" }}
              onClick={() => setMessage(item.message)}
            >
              {item.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div
        className="chat-area"
        style={{ width: "80%", display: "flex", flexDirection: "column" }}
      >
            {/* Chat Title */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#f0f0f0",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
      >
    Welcome to Stride
  </div>
        <div
          className="chat-box"
          style={{
            flexGrow: 1,
            padding: "1rem",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          {chat.map((msg, i) => (
            <div key={i}>
              <b>{msg.sender}:</b> {msg.text}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div
          className="input-area"
          style={{
            display: "flex",
            padding: "0.5rem",
            borderTop: "10px solid #ccc",
            backgroundColor: "#f5f5f5",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ flexGrow: 1, marginRight: "0.5rem", padding: "0.5rem" }}
          />

          {/* Attach and Send buttons wrapper */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <label
              htmlFor="file-upload"
              style={{
                display: "inline-block",
                width: "100px", // fixed same width
                padding: "0.5rem",
                textAlign: "center",
                backgroundColor: "#ddd",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Attach
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <button
              onClick={sendMessage}
              style={{
                width: "100px", // same width as attach
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;