"use client";

import React, { useState } from "react";
import RecipeFilter from "./components/RecipeFilter";
import RecipeDisplay from "./components/RecipeDisplay";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const fetchRecipes = async (ingredients: string) => {
    try {
      const response = await fetch(
        `/api/recipes/filter?ingredients=${ingredients}`
      ); // Updated URL

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Recipe Randomizer
        </h1>
        <RecipeFilter fetchRecipes={fetchRecipes} clearRecipes={clearRecipes} />
        <RecipeDisplay recipes={recipes} />
      </div>
    </div>
  );
};

export default App;
