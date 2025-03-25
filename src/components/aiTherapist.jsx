import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";

const AiTherapist = () => {
    const [input, setInput] = useState(""); // User input
    const [messages, setMessages] = useState([]); // Chat history
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Cohere API configuration
    const COHERE_API_KEY = process.env.REACT_APP_COHERE_API_KEY; 
    const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

    console.log("COHERE_API_KEY:::", COHERE_API_KEY);
    // Initialize with welcome message
    useEffect(() => {
        setMessages([
            {
                role: "ai",
                content: "Welcome to EmpowerHer AI Therapist. I'm here to listen and support you. How are you feeling today?"
            }
        ]);
    }, []);

    // Handle user input submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);

        // Add user message to chat history
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        const userMessage = input;
        setInput("");

        try {
            // Call Cohere API
            const response = await axios.post(
                COHERE_API_URL,
                {
                    message: `Act as a supportive and empathetic mental health therapist responding to: "${userMessage}"`,
                    model: "command", // Use the appropriate Cohere model
                    temperature: 0.7, // Adjust creativity of responses
                    max_tokens: 300, // Increased token limit for more comprehensive responses
                    preamble: "You are an empathetic AI therapist named EmpowerHer. You provide supportive, thoughtful advice and never judge. You ask clarifying questions and help users explore their feelings."
                },
                {
                    headers: {
                        Authorization: `Bearer ${COHERE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Add AI response to chat history
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: response.data.text || response.data.generations[0].text }
            ]);
        } catch (error) {
            console.error("Error calling Cohere API:", error);

            // More detailed error message
            const errorMessage =
                error.response?.data?.message ||
                "I'm having trouble connecting right now. Please check your API key and try again in a moment.";

            setMessages((prev) => [
                ...prev,
                { role: "ai", content: errorMessage }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-Muted to-Accent py-8 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Chat Header */}
                <div className="bg-primary p-4">
                    <h1 className="text-lg font-semibold text-primary-foreground">
                        EmpowerHer AI Therapist
                    </h1>
                    <p className="text-xs text-Muted mt-1">
                        Your mental health companion. Ask me anything.
                    </p>
                </div>

                {/* Chat History */}
                <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-100 scrollbar-thin scrollbar-thumb-Accent scrollbar-track-gray-100">
                    {messages.length === 0 && (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-xs text-gray-600">Start a conversation to begin your session</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg shadow-sm ${msg.role === "user"
                                    ? "bg-Secondary text-white"
                                    : "bg-white text-gray-600 border border-gray-200"
                                    }`}
                            >
                                <div className="flex items-start space-x-2">
                                    <div className={`flex-shrink-0 ${msg.role === "user" ? "mt-1" : "mt-1"
                                        }`}>
                                        {msg.role === "user" ? (
                                            <FaUser className="text-xs" />
                                        ) : (
                                            <FaRobot className="text-xs text-primary" />
                                        )}
                                    </div>
                                    <p className="text-xs leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-white text-gray-600 border border-gray-200">
                                <div className="flex items-start space-x-2">
                                    <div className="flex-shrink-0 mt-1">
                                        <FaRobot className="text-xs text-primary animate-pulse" />
                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-Muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 bg-Muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 bg-Muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 py-2 px-3 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-Secondary focus:border-Secondary"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-Secondary transition-colors disabled:bg-gray-300 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <FaPaperPlane className="text-xs" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AiTherapist;