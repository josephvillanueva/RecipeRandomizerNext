"use client";

import React, { useState } from "react";
import RecipeFilter from "./components/RecipeFilter";
import RecipeDisplay from "./components/RecipeDisplay";

// Define the Recipe interface to ensure type safety
interface Recipe {
  id: number;
  title: string;
  image: string;
}

const Page: React.FC = () => {
  // State to hold fetched recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Use environment variable for API base URL, fallback to localhost for local development
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  // Function to fetch recipes based on ingredients
  const fetchRecipes = async (ingredients: string) => {
    try {
      // Fetch recipes from your API
      const response = await fetch(
        `${API_BASE_URL}/api/recipes/filter?ingredients=${ingredients}`
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Parse the JSON data
      const data = await response.json();
      setRecipes(data); // Update state with the fetched recipes
    } catch (error) {
      console.error("Error fetching recipes:", error); // Log the error
    }
  };

  // Function to clear the recipes from the state
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

export default Page;
