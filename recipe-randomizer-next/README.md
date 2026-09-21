# Recipe Randomizer

Type in what's in your fridge and get recipes that use it, or ask for a random one.

**Live:** https://recipe-randomizer-next.vercel.app

## Features

- **Search by ingredients.** Add ingredients as chips (Enter or comma), and results are ranked by how many of them each recipe uses. Pantry staples such as salt and water don't count as missing.
- **Surprise me.** One click fetches a random recipe with its cooking time and servings.
- **Clear errors.** An exhausted daily quota, an unreachable service and a search with no matches each get their own message.
- Light and dark themes, following the system setting.

## Architecture

![Recipe Randomizer architecture: the browser calls Next.js API routes on Vercel, which add the API key and call the Spoonacular API; recipe photos go through the next/image optimizer](docs/architecture.svg)

The browser never talks to Spoonacular directly. The two API routes validate input and call a shared helper, `app/lib/spoonacular.js`, which adds the key from the server environment, times out after 10 seconds, and turns upstream failures into a 429 or 502 with a readable message. The random route also trims Spoonacular's large response down to the fields the page shows.

## Tech stack

- Next.js 15 and React 19, with TypeScript on the client
- Tailwind CSS
- [Spoonacular API](https://spoonacular.com/food-api)

## Running locally

You need a free Spoonacular API key.

```bash
git clone https://github.com/josephvillanueva/RecipeRandomizerNext.git
cd RecipeRandomizerNext
npm install
echo "API_KEY=your_key_here" > .env.local
npm run dev
```

Then open http://localhost:3000.
