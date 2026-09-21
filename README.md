# Recipe Randomizer

Type in the ingredients you already have and get back recipes you can make with them.

**Live:** https://recipe-randomizer-next.vercel.app

<!-- Add a screenshot and uncomment: -->
<!-- ![Recipe Randomizer search results](docs/screenshot.png) -->

## Features

- Search recipes by a comma-separated list of ingredients
- Clear the search and results in one click
- Loading and empty states
- Responsive layout

## Tech stack

- **Next.js 15** (App Router UI + API routes) with **React 19** and **TypeScript**
- **Tailwind CSS** and Framer Motion
- **[Spoonacular API](https://spoonacular.com/food-api)** for recipe data
- Deployed on **Vercel**

## How it's built

The browser never talks to Spoonacular directly. Requests go through Next.js API routes (`/api/recipes/filter` and `/api/recipes/random`), which:

- **keep the API key server-side**, so it never ships to the client bundle
- **validate input**: GET only, a non-empty ingredients string, and a 500-character cap
- **use a 10-second upstream timeout** and map failures to clear status codes: `429` when Spoonacular's rate limit is hit, `502` for other upstream errors, and `500` if the key is missing

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

- Surface the existing `/api/recipes/random` endpoint as a "Surprise me" button
- Cache repeated ingredient searches to stay under Spoonacular's free-tier quota
- Add filters for missing-ingredient count and diet
