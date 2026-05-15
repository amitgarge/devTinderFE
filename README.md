# DevTinder UI

DevTinder UI is the frontend for a developer networking application where users can sign up, manage their profile, browse developer recommendations, send or review connection requests, and chat with accepted connections in real time.

The app is built with React, Vite, Redux Toolkit, Tailwind CSS, DaisyUI, Axios, React Router, and Socket.IO Client.

## Features

- Email/password login and signup
- Protected routes with session hydration from the backend
- Developer feed with `Ignore` and `Interested` actions
- Editable profile with name, age, gender, about, skills, and photo URL
- Live profile preview while editing
- Pending request review with accept/reject actions
- Connections list with chat entry points
- Real-time chat using Socket.IO
- Typing indicators, online status, last seen, message seen state, and older message pagination
- Global toast notifications for success and error states
- Centralized Axios instance with cookie support and auth failure redirects
- Error boundary around the routed app
- Unit tests with Vitest and React Testing Library

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Redux Toolkit and React Redux
- Axios
- Socket.IO Client
- Tailwind CSS 4
- DaisyUI
- React Hot Toast
- Vitest
- React Testing Library
- ESLint

## Project Structure

```text
src/
  components/          Reusable UI and route components
  hooks/               Custom React hooks
  services/            Axios and Socket.IO clients
  tests/               Vitest test files and setup
  utils/               Redux store, slices, and navigation helper
  App.jsx              Application routes
  main.jsx             React root and Redux provider
  index.css            Tailwind and DaisyUI theme setup
```

Important files:

- `src/App.jsx` - Defines public, protected, nested, and fallback routes.
- `src/services/axiosInstance.js` - Configures API base URL, cookies, response handling, toasts, and 401 redirects.
- `src/services/socket.js` - Creates and manages the Socket.IO client.
- `src/hooks/useChat.js` - Handles chat messages, presence, typing, delivery, seen state, and pagination.
- `src/utils/appStore.js` - Registers Redux slices for user, feed, connections, and requests.
- `render.yaml` - Render static site deployment configuration.
- `public/_redirects` - SPA fallback rewrite for static hosting.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/login` | Public | Login and signup screen |
| `/` | Protected | Developer feed |
| `/profile` | Protected | Edit current user profile |
| `/connections` | Protected | View accepted connections |
| `/requests` | Protected | Review received connection requests |
| `/chat/:targetUserId` | Protected | Real-time chat with a connection |
| `*` | Public fallback | Redirect-style fallback to login screen |

## Prerequisites

- Node.js 20 or later is recommended for this Vite/React toolchain.
- npm
- A running DevTinder backend that exposes the required REST API and Socket.IO server.

## Environment Variables

Create a local environment file such as `.env.local` in the project root.

```env
VITE_API_URL=http://localhost:7777
VITE_BACKEND_URL=http://localhost:7777
```

Variable usage:

- `VITE_API_URL` is used by Axios for REST API requests.
- `VITE_BACKEND_URL` is used by Socket.IO for real-time chat and presence.

The frontend sends credentials with API and socket requests, so the backend must support cookie-based auth and allow the frontend origin through CORS.

## Installation

```bash
npm install
```

## Running Locally

Start the development server:

```bash
npm run dev
```

The Vite dev server runs on:

```text
http://localhost:5173
```

The `dev` script first frees port `5173` with `kill-port`, then starts Vite. The Vite config uses `strictPort: true`, so the app expects that exact port during local development.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server on port 5173 |
| `npm run build` | Create a production build in `dist/` |
| `npm run start` | Serve the production build from `dist/` on port 3000 |
| `npm run preview` | Preview the Vite production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest |
| `npm run test:ui` | Run Vitest UI |

## Backend API Contract

This frontend expects the backend to return JSON responses with data under `data` for most successful requests.

Auth and profile:

- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `GET /profile/view`
- `PATCH /profile/edit`

Feed, requests, and connections:

- `GET /user/feed`
- `POST /request/send/:status/:userId`
- `GET /user/requests/received`
- `POST /request/review/:status/:requestId`
- `GET /user/connections`
- `GET /user/last-seen/:targetUserId`

Messages:

- `GET /messages/:targetUserId?limit=10`
- `GET /messages/:targetUserId?limit=10&cursor=:cursor`

If the backend returns `{ success: false, message: "..." }`, the Axios interceptor displays the message as an error toast and rejects the request.

## Socket.IO Contract

The chat flow expects these socket events:

Client emits:

- `join_room`
- `get_online_users`
- `typing`
- `stop_typing`
- `send_message`

Client listens for:

- `receive_message`
- `messages_seen`
- `message_delivered`
- `message_delivered_bulk`
- `user_typing`
- `user_stop_typing`
- `online_users`
- `user_online`
- `user_offline`

Socket connections are created with:

- `withCredentials: true`
- `transports: ["websocket"]`

## State Management

Redux Toolkit stores these slices:

- `user` - Authenticated user profile or `null`
- `feed` - Developer recommendations shown on the home feed
- `connection` - Accepted connections
- `request` - Received pending connection requests

## Testing

Run all tests:

```bash
npm run test
```

Current test coverage includes:

- Feed rendering and removal after an interested action
- Protected route redirect behavior for authenticated and unauthenticated users

## Build

Create a production build:

```bash
npm run build
```

Serve the build locally:

```bash
npm run start
```

## Deployment

This repository includes a `render.yaml` file for Render static site deployment.

Render configuration:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Rewrite rule: `/* -> /index.html`

The `public/_redirects` file also provides a static hosting rewrite for single-page app routing:

```text
/* /index.html 200
```

Remember to configure production values for:

- `VITE_API_URL`
- `VITE_BACKEND_URL`

## Notes for Development

- Keep backend and frontend origins aligned with cookie and CORS settings.
- Because protected routes hydrate the user from `/profile/view`, login state depends on the backend session cookie.
- The chat page fetches connections if they are not already present in Redux, then derives the target user from that connection list.
- The app uses DaisyUI theme variables in `src/index.css`; update the theme there for global visual changes.
