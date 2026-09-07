"use client";

import React, { useState } from "react";
import RecipeFilter from "./components/RecipeFilter";
import RecipeDisplay from "./components/RecipeDisplay";
import axios from "axios";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const Page: React.FC = () => {
  // State to hold fetched recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been made
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchRecipes = async (ingredients: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get("/api/recipes/filter", {
        params: { ingredients },
      });

      setRecipes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear the recipes from the state
  const clearRecipes = () => {
    setRecipes([]);
    setHasSearched(false); // Reset hasSearched when clearing recipes
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Recipe Randomizer
        </h1>
        <RecipeFilter fetchRecipes={fetchRecipes} clearRecipes={clearRecipes} />

        {loading ? ( // Display loading indicator while fetching recipes
          <p className="text-center">Loading...</p>
        ) : (
          <RecipeDisplay recipes={recipes} hasSearched={hasSearched} />
        )}
      </div>
    </div>
  );
};

export default Page;
