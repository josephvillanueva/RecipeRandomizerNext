# Recipe Randomizer Next

## Project Overview

Recipe Randomizer Next is a web application that allows users to discover recipes based on available ingredients. By inputting ingredients, users receive a list of matching recipes from the Spoonacular API. The app is built with modern frontend and backend technologies, delivering a fast and responsive user experience.

## Features

- Recipe search by entering ingredients
- Clear search results with one click
- Responsive design optimized for various screen sizes
- Minimalist layout for a clean user interface

## Technologies Used

### Frontend

- **React** (with Hooks for state management)
- **Next.js** (for server-side rendering)
- **TypeScript** (strongly typed code)
- **Tailwind CSS** (for styling)

### Backend

- **Node.js** and **Express.js** (for the API layer)
- **Spoonacular API** (for fetching recipe data)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/josephvillanueva/RecipeRandomizerNext.git
cd RecipeRandomizerNext
```

### 2. Install Dependencies

Navigate to the root directory and install dependencies for both frontend and backend:

```bash
npm install
```

### 3. Configure Environment Variables

In the root directory, create a `.env.local` file and add your Spoonacular API key:

```bash
API_KEY=your_spoonacular_api_key
```

Replace `your_spoonacular_api_key` with your actual API key from [Spoonacular](https://spoonacular.com/food-api).

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

Access the app on `http://localhost:3000`.

## Usage

1. Enter ingredients you have on hand.
2. Click **Search** to retrieve recipes.
3. Click **Clear** to reset the input fields and results.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.

## License

This project is licensed under the MIT License.
