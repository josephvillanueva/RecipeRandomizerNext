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

  // Function to fetch recipes based on ingredients using Axios
  const fetchRecipes = async (ingredients: string) => {
    setLoading(true); // Set loading state to true
    setHasSearched(true); // Set hasSearched to true when fetching recipes

    try {
      // Make API request with Axios
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`, {
        params: {
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          includeIngredients: ingredients,
        },
      });

      // Update the recipes state with the data fetched from API
      setRecipes(response.data.results); // Assuming 'results' is where the recipes are in the response
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false); // Set loading state to false after the request is done
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
