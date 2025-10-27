import React from "react";
import dayjs from "dayjs";

export default function MessageBubble({ msg }) {
  const getColor = (sentiment) => {
    switch (sentiment) {
      case "positive": return "#e0ffe0";
      case "negative": return "#ffe0e0";
      case "neutral":  return "#f0f0f0";
      default: return "#f0f0f0";
    }
  };

  const style = {
    backgroundColor: getColor(msg.sentiment),
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "8px",
    maxWidth: "70%",
  };

  return (
    <div style={style}>
      <strong>{msg.user}</strong>
      <div>{msg.content}</div>
      <small style={{ color: "gray" }}>
        {dayjs(msg.timestamp).format("HH:mm:ss")}
      </small>
    </div>
  );
}
