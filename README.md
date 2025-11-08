# Anime Search App (React + TypeScript + Redux Toolkit)

A modern, responsive, 2-page Anime Search application built with React 18, Redux Toolkit, TypeScript, Vite, React Router, Axios, and TailwindCSS. It features instant debounced search, server-side pagination, detail view, loading skeletons, and clean design.

## Features

- React 18 + TypeScript + Vite
- Global state via Redux Toolkit
- Routing with `react-router-dom`
- API data via Jikan API (v4)
- Instant search with custom 250ms debounce
- In-flight request cancellation using `AbortController`
- Server-side pagination (Prev/Next)
- Detail page with poster, synopsis, genres, episodes, status, rating
- TailwindCSS styling with subtle animations and hover effects
- Loading skeletons, empty state, and error UI
- Mobile responsive layout
- Optional: Favorites saved to localStorage (dark/light mode included)
 - Trending anime on initial load (Top Anime)
- Category filtering by genre (chips)
 - Sort by rating (Highest → Lowest or Lowest → Highest)
// Infinite scroll removed; using server-side pagination controls

## Getting Started

Requirements: Node.js 18+ and npm.

```
npm install
npm run dev
```

- Dev server runs on port `4000` (configured in `vite.config.ts`).
- Open http://localhost:4000 in your browser.

## Tech Stack

- Vite + React + TypeScript
- Redux Toolkit + React Redux
- React Router DOM v6
- Axios for HTTP requests (with `AbortController` support)
- TailwindCSS for modern UI

## Project Structure

```
src/
├── api/
│   └── animeApi.ts
├── app/
│   └── store.ts
├── features/
│   └── anime/
│       ├── animeSlice.ts
│       └── animeThunks.ts
├── hooks/
│   └── useDebounce.ts
├── pages/
│   ├── SearchPage.tsx
│   └── DetailPage.tsx
├── components/
│   ├── AnimeCard.tsx
│   ├── SearchBar.tsx
│   └── Pagination.tsx
├── App.tsx
└── main.tsx
```

## API Usage

- Search endpoint: `GET https://api.jikan.moe/v4/anime?q={query}&page={page}&limit=10`
- Detail endpoint: `GET https://api.jikan.moe/v4/anime/{id}`

The app debounces keystrokes by 250ms and cancels any in-flight search request when a new one starts, ensuring fast and correct results.

## Notes

- No environment variables are used.
- Dev server is pinned to port 4000 via `vite.config.ts`.
- Uses npm scripts only.

## Bonus Ideas (not required)

- Favorites stored in `localStorage` (implemented)
- Dark/Light mode toggle (implemented)
- Infinite scroll (removed)
- Trending anime on initial load (implemented)

## Deployment

Build and deploy to Netlify

```
npm run build
# deploy dist/ folder
```

live URL :

- https://magenta-brigadeiros-047446.netlify.app/

## Testing (optional)

You can add unit tests for the Redux slice and debounce behavior using your preferred testing setup (Jest/RTL or Vitest). This template does not include tests by default to keep setup minimal.

## License

This project is provided as-is for demonstration purposes.
