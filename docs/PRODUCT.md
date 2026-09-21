# Product brief: Recipe Randomizer

## Problem

People open the fridge, see a handful of ingredients, and either default to the same meal or order in. Recipe sites start from the dish, not from what's already on hand.

## Who it's for

Home cooks deciding what to make tonight with what's in the kitchen. They're on a phone, short on time, and want an answer in under a minute.

## What v1 does

- Enter the ingredients you have and get back recipes that use them
- One-click clear to start over

## Key decisions

| Decision | Why |
| --- | --- |
| Start from ingredients, not dishes | That's the job to be done: "what can I make with this?", not "how do I make X?" |
| Proxy Spoonacular through Next.js API routes | Keeps the API key off the client, lets the server validate input, and gives one place to add caching and handle rate limits |
| No accounts in v1 | Sign-up friction would kill a single-session tool. Nothing yet needs persistence. |
| Rewrite from Vite + Express to Next.js | One deploy instead of two, and the API routes replace a separate server |

## Out of scope for now

Meal planning, shopping lists, nutrition tracking, user accounts.

## How I'd measure success

No analytics are wired up yet. These are the measures I'd instrument first:

- **Search-to-click rate:** the share of searches where the user opens at least one recipe. This is the core signal that results are useful.
- **Zero-result rate:** the share of searches that return nothing. This shows where matching or input guidance needs work.
- **Upstream calls per search:** keeps the free-tier API quota sustainable.

## What's next

The prioritized backlog is on the [v1.1 milestone](https://github.com/josephvillanueva/RecipeRandomizerNext/milestone/1). "Surprise me" is first because the endpoint already exists, so it's the cheapest way to live up to the product's name.
