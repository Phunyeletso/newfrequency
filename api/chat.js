import { Configuration, OpenAIApi } from "openai";

// Check for the OpenAI API key
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key in environment variables");
}

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        console.log("Incoming request method:", req.method);

        // Add CORS headers
        const allowedOrigins = ["https://www.newfrequency.co.za"];
        if (allowedOrigins.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        } else {
            console.warn("Origin not allowed:", req.headers.origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }

        // Ensure the request is a POST
        if (req.method !== "POST") {
            console.error("Invalid request method:", req.method);
            res.status(405).json({ message: "Only POST requests are allowed" });
            return;
        }

        // Parse the request body
        const { message } = req.body;
        if (!message) {
            console.error("Message is missing in the request body");
            res.status(400).json({ error: "Message is required in the request body" });
            return;
        }
        console.log("Received user message:", message);

        // Create the context and prompt
        const context = `
          Our company, newFrequency, is an NFT platform for artists and content creators.
          Users can create, trade, and use NFTs in videos. For more info, visit our website.
        `;
        const prompt = `${context}\nUser Question: ${message}`;
        console.log("Generated prompt:", prompt);

        // Call the OpenAI API
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });

        // Check OpenAI response
        if (!completion.data.choices || completion.data.choices.length === 0) {
            throw new Error("No choices returned from OpenAI API");
        }
        console.log("OpenAI response:", completion.data);

        const reply = completion.data.choices[0].text.trim();
        console.log("Generated reply:", reply);

        // Send the reply
        res.status(200).json({ reply });
    } catch (error) {
        console.error(
            "Error in /api/chat function:",
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

