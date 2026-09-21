# Recipe Randomizer

Type in the ingredients you already have and get back recipes you can make with them.

**Live:** https://recipe-randomizer-next.vercel.app · **[Product brief](docs/PRODUCT.md)** · **[Roadmap](https://github.com/josephvillanueva/RecipeRandomizerNext/milestone/1)**

<!-- Add a screenshot and uncomment: -->
<!-- ![Recipe Randomizer search results](docs/screenshot.png) -->

## Features

- **Ingredient chips.** Type an ingredient and press Enter or a comma; pasted lists split automatically, and Backspace removes the last one
- **Best matches first.** Results are ranked by how many of your ingredients each recipe uses, with a "you have 3 of 5" meter and the missing ingredients listed
- **Surprise me** picks a random recipe with its cooking time and servings
- **Honest error states.** An exhausted daily quota says so, instead of looking like "no recipes found"
- Loading skeletons, keyboard-accessible controls, and a responsive layout

## Tech stack

- **Next.js 15** (App Router UI + API routes) with **React 19** and **TypeScript**
- **Tailwind CSS** and Framer Motion
- **[Spoonacular API](https://spoonacular.com/food-api)** for recipe data
- Deployed on **Vercel**

## Architecture

![Recipe Randomizer architecture: the browser calls Next.js API routes on Vercel, which add the API key and call the Spoonacular API; recipe photos go through the next/image optimizer](docs/architecture.svg)

## How it's built

The browser never talks to Spoonacular directly. Requests go through Next.js API routes (`/api/recipes/filter` and `/api/recipes/random`), which:

- **keep the API key server-side**, so it never ships to the client bundle
- **validate input**: GET only, a non-empty ingredients string, and a 500-character cap
- **use a 10-second upstream timeout** and map failures to clear status codes: `429` when Spoonacular's quota is used up (Spoonacular reports this as `402` or `429`), `502` for other upstream errors, and `500` if the key is missing
- **trim the random-recipe payload** to the fields the page shows, instead of forwarding long HTML summaries and nutrition data

This is a Next.js rewrite of an earlier Vite + Express version. Moving to API routes removed the separate server and put the frontend and backend in one Vercel deployment.

## Running locally

```bash
git clone https://github.com/josephvillanueva/RecipeRandomizerNext.git
cd RecipeRandomizerNext/recipe-randomizer-next
npm install
echo "API_KEY=your_spoonacular_key" > .env.local
npm run dev
```

Then open http://localhost:3000.

## What I'd do next

- Cache repeated ingredient searches to stay under Spoonacular's free-tier quota
- Add filters for missing-ingredient count and diet
