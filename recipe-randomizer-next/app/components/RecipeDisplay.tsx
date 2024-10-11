// components/RecipeDisplay.tsx

import React from "react";
import Image from "next/image";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeDisplayProps {
  recipes: Recipe[];
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipes }) => {
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="border border-gray-300 p-4 rounded-lg">
          <h2 className="text-lg font-bold">{recipe.title}</h2>
          {recipe.image && (
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={500} // Set a fixed width
              height={300} // Set a fixed height
              className="mt-2 rounded"
              priority // Optional: Load this image with priority
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeDisplay;
