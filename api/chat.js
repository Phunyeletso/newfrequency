export default async function handler(req, res) {
    try {
        // Fetch the API key from the environment variables
        const apiKey = process.env.OPENAI_API_KEY;

        // Log the API key to ensure it is being fetched (remove this in production)
        console.log("Fetched API Key:", apiKey);

        if (!apiKey) {
            console.error("API Key is missing!");
            res.status(500).json({ error: "API Key is missing from environment variables" });
            return;
        }

        // Respond with "Hello World" for now
        res.status(200).send("Hello World");
    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

