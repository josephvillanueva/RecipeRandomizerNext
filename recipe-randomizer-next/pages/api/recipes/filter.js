import axios from "axios";

export default async function handler(req, res) {
  const { ingredients } = req.query;
  const apiKey = process.env.API_KEY;

  // CORS headers (adjust as needed)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Validate API Key
  if (!apiKey) {
    console.error("API_KEY is undefined");
    return res.status(500).json({ error: "API_KEY is not defined" });
  }

  // Validate ingredients parameter
  if (!ingredients || ingredients.trim() === "") {
    return res
      .status(400)
      .json({ error: "Ingredients query parameter is required" });
  }

  const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        ingredients: ingredients,
        apiKey: apiKey,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching from the external API:", error.message);
    return res.status(500).json({
      error: "Error fetching from the external API",
      message: error.message,
    });
  }
}
