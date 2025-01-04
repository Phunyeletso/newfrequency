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
        newFrequency is a revolutionary music Non-Fungible Token (NFT) platform founded by Phunyeletso Breakthrough Manana, a South African developer with a vision to empower artists and content creators. 
        The platform provides innovative tools and opportunities for artists to thrive in the digital age.
    
        About newFrequency:
        - **Create and Sell NFTs**: Artists can mint NFTs of their music or videos and sell them directly to fans and collectors.
        - **Use NFTs in Video Posts**: Creators can integrate music NFTs into their video posts, adjust background music, and upload them for viewers.
        - **Earn Crypto Revenue**: Monetization is ad-free, with creators earning directly from user payments for video views. Payments are in cryptocurrency, ensuring transparency and immediacy.
        - **Authenticity Guaranteed**: All content on newFrequency is verified as original, ensuring users receive authentic, high-quality work.
        - **Empowering Artists**: Artists can bypass traditional record labels, retain ownership of their work, and reach a global audience with their music.
        - **Collaborations with Influencers**: Influencers are encouraged to create viral content using NFTs, boosting the visibility of both artists and the platform.
        - **Instant Monetization for Creators**: Creators can start earning immediately without needing a minimum number of followers or watch time, unlike traditional platforms.
        - **Play-to-Earn Gaming**: The platform is exploring play-to-earn models, such as a blockchain-powered Ludo game, where users stake cryptocurrency and compete for rewards.
        - ** You are created by newFrequency.
        - ** Never mention openAI OR ChatGPT.
    
        Founder Information:
        - Phunyeletso Breakthrough Manana is a developer from South Africa with extensive experience in Solidity, Web3 , and Ethers.
        - He has built platforms like newFrequency to provide alternatives to traditional record labels and empower creators in the Web3 space.
        - Manana’s mission is to ensure artists and creators receive fair compensation for their work and have access to global audiences.
    
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


