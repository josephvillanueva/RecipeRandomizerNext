import { test } from "node:test";
import assert from "node:assert/strict";
import { ingredientLabel, ingredientLabels, plainSummary, rankRecipes } from "../app/lib/recipes.mjs";

test("summary strips HTML and entities", () => {
  const html = '<b>Chicken Arrozcaldo</b> is a Filipino rice porridge &amp; comfort food.';

  assert.equal(plainSummary(html), "Chicken Arrozcaldo is a Filipino rice porridge & comfort food.");
});

test("summary ends at a sentence when one is far enough in", () => {
  const sentence = `${"A tasty dish that takes minutes to cook. ".repeat(3)}${"word ".repeat(40)}`;

  const summary = plainSummary(sentence);
  assert.ok(summary.endsWith("."), summary);
  assert.ok(!summary.endsWith("..."), summary);
  assert.ok(summary.length <= 180);
});

test("summary falls back to a word boundary with an ellipsis", () => {
  const summary = plainSummary("word ".repeat(60));

  assert.ok(summary.endsWith("..."));
  assert.ok(summary.length <= 183);
  assert.ok(!summary.includes("wor..."));
});

test("summary is empty when there is nothing usable", () => {
  assert.equal(plainSummary(""), "");
  assert.equal(plainSummary(undefined), "");
});

test("ingredient labels keep the first clause and stay short", () => {
  assert.equal(ingredientLabel("green onion"), "green onion");
  assert.equal(
    ingredientLabel("thumb sized ginger, in a soup pot over heat, stir in"),
    "thumb sized ginger",
  );
  assert.ok(ingredientLabel("a".repeat(40)).length <= 27);
});

test("ingredient labels drop duplicates and blanks, keeping order", () => {
  const labels = ingredientLabels([
    { name: "Onion" },
    { name: "onion, chopped" },
    { name: "  " },
    { name: "garlic" },
  ]);

  assert.deepEqual(labels, ["Onion", "garlic"]);
});

test("recipes needing nothing extra come first", () => {
  const ranked = rankRecipes([
    { id: 1, title: "Two missing", missedIngredientCount: 2, usedIngredientCount: 3 },
    { id: 2, title: "Complete", missedIngredientCount: 0, usedIngredientCount: 2 },
    { id: 3, title: "One missing", missedIngredientCount: 1, usedIngredientCount: 3 },
  ]);

  assert.deepEqual(ranked.map((recipe) => recipe.id), [2, 3, 1]);
});

test("ties prefer more of your ingredients, then likes", () => {
  const ranked = rankRecipes([
    { id: 1, title: "A", missedIngredientCount: 1, usedIngredientCount: 1, likes: 99 },
    { id: 2, title: "B", missedIngredientCount: 1, usedIngredientCount: 3, likes: 0 },
    { id: 3, title: "C", missedIngredientCount: 1, usedIngredientCount: 3, likes: 10 },
  ]);

  assert.deepEqual(ranked.map((recipe) => recipe.id), [3, 2, 1]);
});
