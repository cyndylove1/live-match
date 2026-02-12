This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Live Match Center 

A real-time football match center application with live scores, match events, statistics, and chat functionality.

## Features

### Completed Requirements

1. **Match Dashboard**
   - Real-time score updates without page refresh
   - Visual distinction between live, upcoming, and finished matches
   - Click to navigate to match details
   - Auto-refresh every 30 seconds

2. **Match Detail View**
   - Live score display with match minute
   - Match timeline with events (goals, cards, substitutions)
   - Live statistics with visual progress bars
   - Proper cleanup of connections when leaving view

3. **Match Chat**
   - Real-time chat room per match
   - Typing indicators
   - User identity stored in localStorage
   - Username change functionality
   - Character limit validation (500 chars)
   - Online user count

4. **Connection Handling**
   - WebSocket connection with automatic reconnection
   - Connection status indicator
   - Graceful error handling
   - State recovery after reconnection

## Additional Features

- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and error boundaries
- Auto-scroll chat to newest messages
- Match progress indicator
- Visual statistics with progress bars
- Clean UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO Client
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## Project Structure

live-match-center/
├── app/ # Next.js app router pages
├── components/ # Reusable React components
├── hooks/ # Custom React hooks
├── lib/ # API and socket clients, types
└── utils/ # Constants and helper functions

## Deployment

**Live Application**: https://live-match.vercel.app  
**GitHub Repository**: https://github.com/yourusername/live-match-center

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/live-match-center.git
cd live-match

```
