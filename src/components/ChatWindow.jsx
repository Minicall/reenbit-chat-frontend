import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    const connect = async () => {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("https://reenbit-chat-api-fsaec3cphuc6dbch.westeurope-01.azurewebsites.net/chat")
        .withAutomaticReconnect()
        .build();

      conn.on("ReceiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      conn.on("LoadMessages", (msgs) => {
        setMessages(msgs.reverse());
      });

      try {
        await conn.start();
        console.log("Connected to SignalR");
        await conn.invoke("GetRecentMessages", 50);
        setConnection(conn);
      } catch (err) {
        console.error("Connection failed:", err);
      }
    };

    connect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!content.trim() || !connection) return;
    try {
      await connection.invoke("SendMessage", user || "Anonymous", content);
      setContent("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="chat-container">
      <h1>Reenbit Chat 💬</h1>

      <div className="chat-box">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
