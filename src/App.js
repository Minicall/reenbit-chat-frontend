import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://reenbit-chat-api-fsaec3cphuc6dbch.westeurope-01.azurewebsites.net/chatHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connect.start()
      .then(() => console.log("Connected to SignalR!"))
      .catch(err => console.error("Connection failed: ", err));

    connect.on("receiveMessage", (user, msg, sentiment) => {
      setMessages(prev => [...prev, { user, msg, sentiment }]);
    });

    setConnection(connect);
  }, []);

  const sendMessage = async () => {
    if (connection && message && user) {
      await connection.invoke("SendMessage", user, message);
      setMessage("");
    }
  };

  const getColor = sentiment => {
    switch (sentiment) {
      case "Positive": return "green";
      case "Negative": return "red";
      default: return "gray";
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>💬 Reenbit Chat</h2>
      <input
        placeholder="Your name"
        value={user}
        onChange={e => setUser(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <div style={{
        border: "1px solid #ccc", height: 300, overflowY: "scroll", marginBottom: 10, padding: 10
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ color: getColor(m.sentiment) }}>
            <strong>{m.user}:</strong> {m.msg} <em>({m.sentiment})</em>
          </div>
        ))}
      </div>
      <input
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ width: "18%", marginLeft: "2%" }}>Send</button>
    </div>
  );
}

export default App;
