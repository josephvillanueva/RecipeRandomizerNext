"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiInformationCircle } from "react-icons/hi";

interface RecipeFilterProps {
  fetchRecipes: (ingredients: string) => void;
  clearRecipes: () => void;
}

const RecipeFilter: React.FC<RecipeFilterProps> = ({
  fetchRecipes,
  clearRecipes,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

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
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Enter ingredients..."
          className="p-2 border rounded w-full"
        />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <span
            className="text-gray-500 text-xs cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <HiInformationCircle className="hover:text-blue-500 transition-colors duration-300 text-xl" />{" "}
            <motion.span
              className={`tooltip ${showTooltip ? "show-tooltip" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showTooltip ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Separate ingredients with a comma (e.g., bacon, egg)
            </motion.span>
          </span>
        </div>
      </div>
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
