import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    // Allow requests from your custom domain
    res.setHeader("Access-Control-Allow-Origin", "https://www.newfrequency.co.za");

    // Allow specific HTTP methods
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    // Allow specific headers
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests are allowed" });
        return;
    }

    const { message } = req.body;

    const context = `
    Our company, newFrequency, is an NFT platform for artists and content creators.
    Users can create, trade, and use NFTs in videos. For more info, visit our website.
  `;
    const prompt = context + `\nUser Question: ${message}`;

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150,
        });

        const reply = completion.data.choices[0].text.trim();
        res.status(200).json({ reply });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

