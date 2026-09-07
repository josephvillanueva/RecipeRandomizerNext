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

  const { ingredients } = req.query;
  if (typeof ingredients !== "string" || ingredients.trim() === "") {
    return res
      .status(400)
      .json({ error: "Ingredients query parameter is required" });
  }
  if (ingredients.length > 500) {
    return res.status(400).json({ error: "Ingredients query too long" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients: ingredients.trim(),
          apiKey,
        },
        timeout: 10000,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching from Spoonacular:", error.message);
    const status = error.response?.status === 429 ? 429 : 502;
    return res
      .status(status)
      .json({ error: "Failed to fetch recipes from upstream" });
  }
}
