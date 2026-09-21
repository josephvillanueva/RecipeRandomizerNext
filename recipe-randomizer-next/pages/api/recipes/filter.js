import { spoonacular } from "../../../app/lib/spoonacular";

const MAX_LENGTH = 500;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { ingredients } = req.query;
  if (typeof ingredients !== "string" || ingredients.trim() === "") {
    return res
      .status(400)
      .json({ error: "Enter at least one ingredient to search." });
  }
  if (ingredients.length > MAX_LENGTH) {
    return res.status(400).json({ error: "That ingredient list is too long." });
  }

  const { status, body } = await spoonacular("/recipes/findByIngredients", {
    ingredients: ingredients.trim(),
    number: 12,
    // Rank by how many of your ingredients each recipe uses, and do not count
    // pantry staples such as salt and water as missing.
    ranking: 1,
    ignorePantry: true,
  });
  return res.status(status).json(body);
}
