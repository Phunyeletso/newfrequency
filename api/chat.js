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

        const context = "You are a helpful assistant for the newFrequency platform. Provide responses related to NFTs, artists, and content creation.";

        const completion = await openai.chat.completions.create({
            model: "gpt-4", // You can adjust the model as needed (e.g., "gpt-3.5-turbo" if "gpt-4" is unavailable)
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

