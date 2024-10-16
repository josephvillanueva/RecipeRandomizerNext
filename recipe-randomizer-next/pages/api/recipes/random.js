import axios from "axios";

export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    res.status(500).json({ error: "Error fetching random recipe" });
  }
}
