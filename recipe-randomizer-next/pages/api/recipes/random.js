import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is undefined");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/random",
      {
        params: { apiKey },
        timeout: 10000,
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching random recipe:", error.message);
    const status = error.response?.status === 429 ? 429 : 502;
    return res
      .status(status)
      .json({ error: "Failed to fetch random recipe from upstream" });
  }
}
