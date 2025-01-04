import { Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key in environment variables");
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        // Add CORS headers
        const allowedOrigins = ["https://www.newfrequency.co.za"];
        if (allowedOrigins.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight request
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }

        if (req.method !== "POST") {
            res.status(405).json({ message: "Only POST requests are allowed" });
            return;
        }

        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: "Message is required in the request body" });
            return;
        }

        console.log("Received user message:", message);

        const context = `
          Our company, newFrequency, is an NFT platform for artists and content creators.
          Users can create, trade, and use NFTs in videos. For more info, visit our website.
        `;
        const prompt = context + `\nUser Question: ${message}`;
        console.log("Generated prompt:", prompt);

        const completion = await openai.createCompletion({
            model: "text-davinci-003", // Use "gpt-3.5-turbo" if appropriate
            prompt: prompt,
            max_tokens: 150,
        });

        if (!completion.data.choices || completion.data.choices.length === 0) {
            throw new Error("No choices returned from OpenAI API");
        }

        console.log("OpenAI response:", completion.data);

        const reply = completion.data.choices[0].text.trim();
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error in /api/chat function:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

