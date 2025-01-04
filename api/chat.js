export default async function handler(req, res) {
    try {
        console.log("Request method:", req.method);

        // Add CORS headers
        const allowedOrigins = ["https://www.newfrequency.co.za"];
        if (allowedOrigins.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight request
        if (req.method === "OPTIONS") {
            console.log("OPTIONS request handled");
            res.status(200).end();
            return;
        }

        if (req.method !== "GET") {
            res.status(405).json({ message: "Only GET requests are allowed" });
            return;
        }

        console.log("Returning Hello World response");
        res.status(200).send("Hello World");
    } catch (error) {
        console.error("Error in Hello World handler:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

