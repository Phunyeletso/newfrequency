import { Configuration, OpenAIApi } from "openai";

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Use environment variable
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    // Add CORS headers to allow requests from your frontend
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins for production testing
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allow POST and OPTIONS methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    console.log("Incoming request:", req.method);

    if (req.method !== "POST") {
        console.error("Invalid request method");
        res.status(405).send({ message: "Only POST requests are allowed" });
        return;
    }

    const { message } = req.body;
    console.log("User message received:", message);

    const context = `
    Our company, newFrequency, is an NFT platform for artists and content creators.
    Users can create, trade, and use NFTs in videos. For more info, visit our website.
  `;
    const prompt = context + `\nUser Question: ${message}`;
    console.log("Generated prompt:", prompt);

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });

        const reply = completion.data.choices[0].text.trim();
        console.log("OpenAI reply:", reply);
        res.status(200).json({ reply });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}




