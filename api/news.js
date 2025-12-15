export default async function handler(req, res) {
    // 1. Get the private key from server environment
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            status: "error",
            message: "Server Error: NEWS_API_KEY is not configured in Vercel."
        });
    }

    try {
        // 2. Build the NewsAPI URL (matching what we had in the frontend)
        const baseUrl = "https://newsapi.org/v2/everything";
        const url = new URL(baseUrl);

        // Hardcoded query params for security (prevents abuse)
        url.searchParams.append("q", "NBA OR basketball OR baloncesto");
        url.searchParams.append("language", "en");
        url.searchParams.append("sortBy", "publishedAt");
        url.searchParams.append("apiKey", apiKey);

        // 3. Fetch from NewsAPI (Server-to-Server)
        const response = await fetch(url.toString());
        const data = await response.json();

        // 4. Return the result to our frontend
        // Set Cache-Control for performance (cache for 15 mins)
        res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch news",
            error: error.message
        });
    }
}
