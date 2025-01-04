import { Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_API_KEY) {
    console.error("Environment variable OPENAI_API_KEY is missing!");
    throw new Error("Missing OpenAI API key in environment variables");
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        console.log("Request method:", req.method);

        // Add CORS headers
        const allowedOrigins = ["https://www.newfrequency.co.za"];
        if (allowedOrigins.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        } else {
            console.warn("Origin not allowed:", req.headers.origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight request
        if (req.method === "OPTIONS") {
            console.log("OPTIONS request handled");
            res.status(200).end();
            return;
        }

        if (req.method !== "POST") {
            console.error("Invalid request method:", req.method);
            res.status(405).json({ message: "Only POST requests are allowed" });
            return;
        }

        const { message } = req.body;
        if (!message) {
            console.error("Message is missing in the request body");
            res.status(400).json({ error: "Message is required in the request body" });
            return;
        }

        console.log("User message received:", message);

        const context = `
          Our company, newFrequency, is an NFT platform for artists and content creators.
          Users can create, trade, and use NFTs in videos. For more info, visit our website.
        `;
        const prompt = context + `\nUser Question: ${message}`;
        console.log("Generated prompt for OpenAI API:", prompt);

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });

        console.log("OpenAI API response:", completion.data);

        if (!completion.data.choices || completion.data.choices.length === 0) {
            console.error("No choices returned from OpenAI API");
            throw new Error("Invalid OpenAI API response");
        }

        const reply = completion.data.choices[0].text.trim();
        console.log("Generated reply:", reply);

        res.status(200).json({ reply });
    } catch (error) {
        console.error(
            "Error in serverless function:",
            error.response ? error.response.data : error.message
        );
        res.status(500).json({
            error: "Internal Server Error",
            details: error.response ? error.response.data : error.message,
        });
    }
}

