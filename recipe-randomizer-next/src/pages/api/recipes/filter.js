// src/pages/api/recipes/filter.js

import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { ingredients } = req.query;

    // Check if ingredients were provided
    if (!ingredients) {
      return res
        .status(400)
        .json({ error: "Ingredients query parameter is required." });
    }

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${process.env.API_KEY}`
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching from the external API:", error);
      res.status(500).json({ error: "Error fetching filtered recipes" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
