import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import motion from framer-motion

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeDisplayProps {
  recipes: Recipe[];
  hasSearched: boolean; // New prop to indicate if a search has been made
}

// RecipeDisplay component to render a list of recipes
const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipes,
  hasSearched,
}) => {
  // Show message only if a search has been made and no recipes are found
  if (!hasSearched) return null; // Do not show anything if no search has been made
  if (recipes.length === 0) return <p>No recipes found.</p>; // Show message if no recipes are found

  return (
    <div className="grid grid-cols-1 gap-4">
      {recipes.map((recipe) => (
        <motion.div
          key={recipe.id}
          className="border border-gray-300 p-4 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-bold">{recipe.title}</h2>
          {recipe.image && (
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={500} // Set a fixed width
              height={300} // Set a fixed height
              className="mt-2 rounded"
              priority // Load this image with priority
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default RecipeDisplay;
