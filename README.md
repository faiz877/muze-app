# Muze App

A social media feed application built with Next.js and React, demonstrating real-time updates and infinite scroll using client-side data simulation.

## Overview

This project simulates a dynamic social media feed, showcasing core front-end development patterns for a job assessment.

## Live Demo

Experience the live application here: [https://muze-app-two.vercel.app/](https://muze-app-two.vercel.app/)

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
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

No separate API server is needed.

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Technical Decisions & Implementation Highlights

*   **Client-Side Data Simulation:** Data fetching and real-time updates are simulated using local mock data (`api/mockData.ts`) and client-side JavaScript.
    *   **Real-time Updates:** New posts are periodically prepended to the feed via a `setInterval` in `app/components/FeedList.tsx`, using `MOCK_POSTS_POOL`.
    *   **Infinite Scroll:** More posts are loaded from `MOCK_POSTS` in `app/components/FeedList.tsx` as the user scrolls, simulating pagination.
*   **Next.js 15 & React 19:** Utilizes the latest versions for modern features and performance.
*   **State Management:** `Zustand` manages feed data and loading states (`store/feedStore.ts`).
*   **Image Handling:**
    *   Post images use Unsplash URLs from `api/mockData.ts`.
    *   A robust fallback in `app/components/PostCard.tsx` displays a randomly selected local image (`/test.jpeg` to `/test5.jpeg`) if an Unsplash image fails.
    *   Profile images for posts also cycle through local SVG placeholders (`/profile1.svg` to `/profile5.svg`).
    *   The header's user profile image is a dedicated local image (`/profile2.jpg`).

## Scalability & Accessibility Considerations

### Scalability

The architecture of this application, while currently using client-side data simulation, is designed with scalability in mind. The clear separation of concerns between UI components, state management (Zustand), and data handling (mocked GraphQL layer) allows for easy integration with a real backend GraphQL API in the future. The modular component design promotes reusability and maintainability, which are crucial for larger projects. Pagination for infinite scroll ensures that only necessary data is loaded, preventing performance bottlenecks as the dataset grows. Real-time updates, when backed by a robust subscription service, can efficiently handle a high volume of new content.

### Accessibility

Accessibility has been considered throughout the UI development. Semantic HTML elements are used where appropriate to provide a meaningful structure for assistive technologies. Interactive elements like buttons are focusable and keyboard-operable. Image fallbacks ensure that content remains understandable even if visual assets fail to load. While comprehensive ARIA attributes and full keyboard navigation testing would be part of a production-ready application, the foundational elements for an accessible user experience are in place.

## Assumptions

*   A full backend (e.g., GraphQL API with subscriptions) is conceptual for this assessment; functionality is simulated client-side.
*   Minor UI details and comprehensive error handling were implemented based on best practices.

## Testing

### Real-time Updates

New posts appear automatically every 10 seconds. Open multiple browser tabs to `http://localhost:3000` to observe simultaneous updates.

### Infinite Scroll

Scroll to the bottom of the feed to load more posts from the mock data.

## Project Structure (Simplified)

```
/
├── app/                # Next.js application code
├── public/             # Static assets (images)
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── package.json        # Project dependencies and scripts
├── README.md           # This file
```