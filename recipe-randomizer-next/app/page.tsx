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

  // Use environment variable for API base URL (for Spoonacular API in production)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch recipes based on ingredients
  const fetchRecipes = async (ingredients: string) => {
    try {
      // Fetch recipes from the Spoonacular API using the environment variable
      const response = await fetch(`${API_BASE_URL}&query=${ingredients}`);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Parse the JSON data
      const data = await response.json();
      setRecipes(data.results || []); // Update state with the fetched recipes
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
