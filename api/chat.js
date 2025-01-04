import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Fetch API key from environment variables
});

export default async function handler(req, res) {
    try {
        console.log("Request method:", req.method);

        if (req.method !== "POST") {
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
            You are an AI assistant for the newFrequency platform. 
            newFrequency is a music Non Fungible Token platform empowering artists and content creators.
            It allows users to:
            - Create and sell NFTs of their music or videos.
            - Use NFTs in video posts with adjustable background music.
            - Earn crypto-based revenue without ads, directly from user payments for views.
            - Ensure authenticity by verifying that all content is original and owned by creators.
            - Help artists monetize their music and reach a global audience without relying on record labels.
            - Collaborate with influencers who create viral videos using NFTs.
            
            Respond briefly and focus on helping users understand how newFrequency works or addressing related questions.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4", // You can adjust the model as needed (e.g., "gpt-3.5-turbo")
            messages: [
                { role: "system", content: context },
                { role: "user", content: message },
            ],
        });

        console.log("OpenAI API response:", completion);

        const reply = completion.choices[0].message.content.trim();
        console.log("Generated reply:", reply);

        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error in serverless function:", error.response ? error.response.data : error.message);
        res.status(500).json({
            error: "Internal Server Error",
            details: error.response ? error.response.data : error.message,
        });
    }
}


