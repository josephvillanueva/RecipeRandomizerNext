import axios from "axios";

export default async function handler(req, res) {
  const { ingredients } = req.query;
  const apiKey = process.env.API_KEY;

  // Ensure the API URL is correct
  const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients";

  if (!apiKey) {
    console.error("API_KEY is undefined");
    return res.status(500).json({ error: "API_KEY is not defined" });
  }

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
    return res
      .status(500)
      .json({ error: "Error fetching from the external API" });
  }
}
