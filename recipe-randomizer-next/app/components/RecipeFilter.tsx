"use client";

import React, { useState } from "react";

interface RecipeFilterProps {
  fetchRecipes: (ingredients: string) => void;
  clearRecipes: () => void;
}

const RecipeFilter: React.FC<RecipeFilterProps> = ({
  fetchRecipes,
  clearRecipes,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchRecipes(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    clearRecipes();
  };

  return (
    <div className="flex flex-col mb-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Enter ingredients..."
        className="p-2 border rounded"
      />
      <div className="flex justify-between mt-2">
        <button
          onClick={() => fetchRecipes(inputValue)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default RecipeFilter;
