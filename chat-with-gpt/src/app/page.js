// src/app/page.js
"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post("/api/chat", { message: userInput });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: response.data.text },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Error: Failed to get response from server" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-10">Chat with GPT-3.5</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-5 rounded-lg shadow-lg">
        <div
          id="chatbox"
          className="h-96 overflow-y-scroll mb-4 p-4 bg-gray-700 rounded-lg space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-right"
                  : "bg-green-500 text-left"
              }`}
            >
              <b>{msg.sender === "user" ? "You" : "GPT-3.5"}:</b> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-3 rounded-lg bg-gray-600 text-white mr-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
