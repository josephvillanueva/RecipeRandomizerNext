import { spoonacular } from "../../../app/lib/spoonacular";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { status, body } = await spoonacular("/recipes/random", { number: 1 });
  if (status !== 200) return res.status(status).json(body);

  // Send only what the page renders instead of the full upstream payload,
  // which includes long HTML summaries and nutrition data.
  const recipe = body.recipes?.[0];
  if (!recipe) {
    return res
      .status(502)
      .json({ error: "The recipe service returned no recipe." });
  }
  const { id, title, image, readyInMinutes, servings, sourceUrl, spoonacularSourceUrl } =
    recipe;
  return res
    .status(200)
    .json({ id, title, image, readyInMinutes, servings, sourceUrl, spoonacularSourceUrl });
}
