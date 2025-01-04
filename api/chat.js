import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        // Add CORS headers
        res.setHeader("Access-Control-Allow-Origin", "https://www.newfrequency.co.za"); // Allow your custom domain
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight request
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }

        if (req.method !== "POST") {
            res.status(405).send({ message: "Only POST requests are allowed" });
            return;
        }

        const { message } = req.body;
        console.log("Received user message:", message); // Debugging user input

        const context = `
      Our company, newFrequency, is an NFT platform for artists and content creators.
      Users can create, trade, and use NFTs in videos. For more info, visit our website.
    `;
        const prompt = context + `\nUser Question: ${message}`;
        console.log("Generated prompt:", prompt); // Debugging generated prompt

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });

        console.log("OpenAI response:", completion.data); // Debugging OpenAI response

        const reply = completion.data.choices[0].text.trim();
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error in /api/chat function:", error.response ? error.response.data : error.message); // Detailed error log
        res.status(500).json({ error: "Internal Server Error" });
    }
}

