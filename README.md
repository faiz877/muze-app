# Muze App

This is a simple social media feed application built with Next.js, GraphQL, and Apollo Client. It features real-time updates with GraphQL Subscriptions and infinite scroll.

## Overview

The application displays a feed of posts that automatically updates in real-time when new posts are available. Users can also load more posts by scrolling to the bottom of the feed.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Servers

The application requires two servers to be running concurrently:

1. **Next.js Development Server:** This server is for the main application.
2. **WebSocket Server:** This server is for handling GraphQL Subscriptions.

To start the servers, run the following commands in two separate terminals:

**Terminal 1: Start the Next.js development server**

```bash
npm run dev
```

This will start the Next.js server on `http://localhost:3000`.

**Terminal 2: Start the WebSocket server**

```bash
npm run ws
```

This will start the WebSocket server on `ws://localhost:4000/graphql/subscriptions`.

## Key Design & Technical Decisions

### Next.js 15 & React 19

The application is built with the latest versions of Next.js and React, taking advantage of the latest features and performance improvements.

### GraphQL API with Apollo Server

The application uses a GraphQL API to fetch and update data. The API is built with Apollo Server and is located in the `app/api/graphql/route.ts` file.

### Real-time Updates with GraphQL Subscriptions

The application uses GraphQL Subscriptions to provide real-time updates to the feed. The WebSocket server is responsible for handling the subscriptions and is located in the `graphql/ws-server.ts` file.

### Infinite Scroll with Apollo Client

Infinite scroll is implemented using the `@apollo/client` library. The `useQuery` hook is used to fetch the initial data, and the `fetchMore` function is used to load more posts when the user scrolls to the bottom of the feed.

### State Management with Zustand

The application uses Zustand for state management. The feed store is located in the `store/feedStore.ts` file.

### UI Components

The UI components are located in the `app/components` directory. The components are built with React and styled with Tailwind CSS.

## Assumptions

- The GraphQL schema is defined in the `graphql/schema.ts` file.
- The mock data for the API is located in the `api/mockData.ts` file.
- The application is designed to replicate the UI from the provided image.

## Testing

### Real-time Updates

To test the real-time updates, open the application in two separate browser windows. When a new post is added, it should appear in both windows simultaneously.

### Infinite Scroll

To test the infinite scroll, scroll to the bottom of the feed. More posts should be loaded automatically.

## Project Structure

```
/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # UI components
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── graphql/            # GraphQL schema, resolvers, and WebSocket server
├── lib/                # Apollo Client configuration
├── public/             # Static assets
├── store/              # Zustand store
└── types/              # GraphQL types
```