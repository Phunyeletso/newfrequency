import React, { useState } from "react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Send message to API
    const handleSendMessage = async () => {
        if (!input.trim()) {
            console.warn("No input provided"); // Log if input is empty
            return;
        }

        console.log("Sending user message:", input); // Log the user input
        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("https://www.newfrequency.co.za/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            console.log("API response status:", response.status); // Log the API response status
            const data = await response.json();
            console.log("API response data:", data); // Log the response data

            if (data.reply) {
                const botMessage = { text: data.reply, sender: "bot" };

                // Add bot's message to chat and convert it to speech
                setMessages((prev) => [...prev, botMessage]);
                const utterance = new SpeechSynthesisUtterance(botMessage.text);
                speechSynthesis.speak(utterance);
            } else {
                console.error("No reply received from API");
            }
        } catch (error) {
            console.error("Error communicating with the chatbot:", error); // Log any errors
        }

        setInput("");
    };

    // Handle audio input
    const handleAudioInput = () => {
        console.log("Starting audio input"); // Log when audio input starts
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Audio transcript:", transcript); // Log the transcript
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Audio input error:", event.error); // Log audio errors
            setIsListening(false);
            alert("Could not understand audio. Please try again.");
        };
    };

    // Toggle chatbot visibility
    const toggleChatbot = () => {
        console.log("Toggling chatbot visibility"); // Log when the chatbot is toggled
        setIsOpen((prev) => !prev);
    };

    return (
        <div style={styles.container}>
            <button onClick={toggleChatbot} style={styles.toggleButton}>
                {isOpen ? "Close" : "Chat"}
            </button>

            {isOpen && (
                <div style={styles.chatbotContainer}>
                    <div style={styles.chatWindow}>
                        {messages.map((msg, index) => (
                            <div key={index} style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                                {msg.sender === "bot" && <img src="/bot-icon.png" alt="Bot" style={styles.botImage} />}
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={styles.input}
                        />
                        <button onClick={handleSendMessage} style={styles.sendButton}>
                            Send
                        </button>
                        <button onClick={handleAudioInput} style={styles.audioButton}>
                            {isListening ? "Listening..." : "🎙️"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
    },
    toggleButton: {
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        padding: "10px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    chatbotContainer: {
        width: "300px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
    },
    chatWindow: {
        height: "400px",
        overflowY: "scroll",
        padding: "10px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderTop: "1px solid #ccc",
    },
    input: {
        flex: 1,
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    sendButton: {
        marginLeft: "10px",
        padding: "8px 12px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    audioButton: {
        marginLeft: "10px",
        padding: "8px 12px",
        backgroundColor: "#28A745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#007BFF",
        color: "#fff",
        borderRadius: "10px",
        padding: "8px",
        marginBottom: "5px",
        maxWidth: "80%",
        wordWrap: "break-word",
    },
    botMessage: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        color: "#333",
        borderRadius: "10px",
        padding: "8px",
        marginBottom: "5px",
        maxWidth: "80%",
        wordWrap: "break-word",
    },
    botImage: {
        width: "30px",
        height: "30px",
        marginRight: "10px",
    },
};

export default Chatbot;


