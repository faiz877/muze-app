# Muze App

This is a simple social media feed application built with Next.js and React. It features real-time updates and infinite scroll, demonstrating modern web development patterns.

## Overview

The application displays a feed of posts that updates in real-time with new content. Users can also load more posts by scrolling to the bottom of the feed. This project was developed as part of a job assessment to showcase understanding of front-end development, state management, and UI/UX considerations.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/faiz877/muze-app.git
    cd muze-app
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Project Locally

This project uses a mock data setup for the feed, so no separate API server is required.

To start the Next.js development server:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`.

## Mock GraphQL API and Subscriptions Setup

For this assessment, a full GraphQL API and WebSocket server are *not* required to run the application. The application simulates GraphQL behavior using local mock data and client-side logic.

*   **Mock Data:** Post data is sourced from `api/mockData.ts`. This file contains two main arrays:
    *   `MOCK_POSTS`: Used for the initial feed load and subsequent infinite scroll pagination.
    *   `MOCK_POSTS_POOL`: Used to simulate new posts arriving in real-time.
*   **Simulated Subscriptions (Real-time Updates):** Real-time updates are simulated directly within `app/components/FeedList.tsx` using a `setInterval` that periodically prepends new posts from `MOCK_POSTS_POOL` to the feed.
*   **Simulated Queries (Infinite Scroll):** Infinite scroll is also handled within `app/components/FeedList.tsx` by slicing `MOCK_POSTS` based on the current page and appending new data to the feed when the user scrolls to the bottom.

## Key Design & Technical Decisions

*   **Next.js 15 & React 19:** Built with the latest versions to leverage modern features, performance optimizations, and the App Router architecture.
*   **Client-Side Data Simulation:** Instead of a full backend, GraphQL queries and subscriptions are simulated using local mock data (`api/mockData.ts`) and client-side JavaScript logic. This allows for rapid prototyping and demonstration of UI behavior without backend dependencies.
*   **Apollo Client Configuration (Mocked):** While Apollo Client is configured (`lib/apolloClient.ts`), its primary role in this mock setup is to provide the necessary context and types. Actual data fetching (`useQuery`, `fetchMore`) and real-time updates (`useMutation` for like/repost) are handled by direct state manipulation and simulated network calls within `FeedList.tsx`.
*   **UI Replication & Responsiveness:** The UI aims to replicate a modern social media feed, focusing on clean design and responsiveness across different screen sizes. Key UI components are modularized in `app/components/ui/`.
*   **State Management with Zustand:** `Zustand` is used for efficient and flexible state management, particularly for the main feed (`store/feedStore.ts`). It provides a centralized and reactive way to manage post data, loading states, and pagination.
*   **Image Handling & Fallbacks:**
    *   Post images are sourced from Unsplash URLs in `api/mockData.ts`.
    *   A robust fallback mechanism is implemented in `app/components/PostCard.tsx`. If an Unsplash image fails to load, a randomly selected local placeholder image (`/test.jpeg` to `/test5.jpeg` from the `public` directory) is displayed. This ensures a consistent visual experience even with external image loading issues.
    *   Profile images for posts also cycle through a set of local SVG placeholders (`/profile1.svg` to `/profile5.svg`) for a more natural and varied appearance.
    *   The main user profile image in the header (`app/components/Header.tsx`) uses a dedicated local image (`/profile2.jpg`) for a personalized touch.

## Assumptions Made

*   **GraphQL Schema:** It's assumed that a GraphQL schema (defined in `graphql/schema.ts`) would exist in a production environment, even though the current implementation bypasses direct GraphQL queries for mock data.
*   **Missing Design Details:** Minor design elements not explicitly provided in a visual mock (e.g., specific hover states, detailed typography) were implemented based on common UI/UX best practices for social media feeds.
*   **User Authentication/Interaction:** User authentication, commenting, sharing, and detailed user profiles are outside the scope of this assessment and are simulated or represented by placeholder actions.
*   **Error Handling:** Basic error handling for network issues is present, but comprehensive global error handling strategies are not fully implemented.

## Instructions for Testing

### Real-time Updates

The feed automatically receives new posts every 10 seconds.

1.  Start the application (`npm run dev`).
2.  Observe the feed. New posts will appear at the top of the feed periodically.
3.  To see the effect more clearly, open two browser tabs/windows to `http://localhost:3000`. New posts will appear simultaneously in both.

### Infinite Scroll

1.  Start the application (`npm run dev`).
2.  Scroll down the feed. As you approach the bottom, more posts from the `MOCK_POSTS` array will automatically load and append to the feed.
3.  Continue scrolling until you reach the end of the available mock data.

## Project Structure

```
/
├── app/                # Next.js app directory
│   ├── api/            # API routes (includes mockData.ts)
│   ├── components/     # UI components (FeedList, PostCard, Header, etc.)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── graphql/            # GraphQL schema, resolvers (conceptual for mock)
├── lib/                # Apollo Client configuration (conceptual for mock)
├── public/             # Static assets (local images: testX.jpeg, profileX.svg, user_profile.svg)
├── store/              # Zustand store (feedStore.ts)
├── types/              # GraphQL types
├── .gitignore
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md           # This file
├── tsconfig.json
```