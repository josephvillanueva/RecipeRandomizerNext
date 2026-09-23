import { test } from "node:test";
import assert from "node:assert/strict";
import { dishIntro, ingredientLabel, ingredientLabels, rankRecipes } from "../app/lib/recipes.mjs";

test("intro names the cuisine and dish type, then time and servings", () => {
  const intro = dishIntro({
    cuisines: ["Korean"],
    dishTypes: ["main course"],
    readyInMinutes: 45,
    servings: 4,
  });

  assert.equal(intro, "Korean main course, ready in 45 minutes, serves 4.");
});

test("intro works with only a dish type", () => {
  assert.equal(dishIntro({ dishTypes: ["side dish"], servings: 1 }), "Side dish, serves 1.");
});

test("intro is empty when the dish has no kind, however much else is known", () => {
  assert.equal(dishIntro({ cuisines: [], dishTypes: [], readyInMinutes: 30, servings: 4 }), "");
  assert.equal(dishIntro({}), "");
  assert.equal(dishIntro(undefined), "");
});

test("intro ignores nonsense times and servings", () => {
  const intro = dishIntro({
    dishTypes: ["soup"],
    readyInMinutes: 0,
    servings: null,
  });

  assert.equal(intro, "Soup.");
});

test("intro skips a label too long to read as a dish type", () => {
  const intro = dishIntro({ dishTypes: ["antipasti, starter, snack, appetizer"], servings: 2 });

  assert.equal(intro, "");
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
