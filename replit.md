# Wolt Food Quiz - Tel Aviv Restaurant Game

## Overview
A Wolt-inspired food guessing game where players identify Tel Aviv restaurants from dish images. Players select a food category (or play with all categories) and answer 10 multiple-choice questions per round, with real-time score tracking throughout the session.

## Project Architecture

### Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Data**: JSON files (dishes and venues from Wolt)
- **Storage**: In-memory storage for game sessions

### Design System
- **Primary Color**: Wolt Turquoise (#00C2E8 / HSL 188 100% 45%)
- **Secondary Color**: Wolt Orange (#FF6B35 / HSL 17 100% 60%)
- **Typography**: System font stack (Inter/Roboto fallback)
- **Layout**: Card-based, mobile-first responsive design, viewport-optimized (no scrolling needed)
- **Modern Effects**: 3D transforms, Framer Motion animations, gradient backgrounds, glassmorphism
- **Interactions**: Smooth transitions, 3D hover effects, animated feedback, staggered reveals

## Features
- ✅ Category selection screen with food type filters
- ✅ "All Categories" option for mixed gameplay
- ✅ 10-question quiz rounds with random dish images
- ✅ 4 multiple-choice restaurant options per question
- ✅ Real-time score tracking and progress bar
- ✅ Immediate visual feedback (correct/wrong answers)
- ✅ Final score screen with answer breakdown
- ✅ Beautiful loading and error states
- ✅ Fully responsive design

## Data Structure

### JSON Files
1. `attached_assets/dishes_1763419547138.json` (Updated 2025-11-17)
   - Organized by restaurant name
   - Contains dish data: name, price, description, image URL
   - 1410 restaurants total, 1403 with available dishes

2. `attached_assets/venues_information_1763412625528.json`
   - Restaurant metadata
   - Contains: venue_id, rating, location, category tags, description

### Game Logic
- Questions are randomly selected from available dishes
- Options include 4 restaurants from the same category
- Categories are extracted from venue tags
- Score is tracked throughout the session

## Recent Changes
- **2025-11-17**: Updated Dishes Database
  - ✅ Replaced with new dishes file: `dishes_1763419547138.json`
  - ✅ Successfully loaded 1410 restaurants with 1403 having dish data
  - ✅ All game functionality verified with new dataset
  - ✅ E2E testing confirms complete game flow works perfectly

- **2025-11-17**: Modern 3D Design Upgrade Complete
  - ✅ **3D Effects & Animations**: Integrated Framer Motion with perspective transforms (rotateX, rotateY, scale)
  - ✅ **Modern Styling**: Gradient backgrounds, glassmorphism with backdrop-blur, enhanced shadows
  - ✅ **Viewport Optimization**: Quiz fits entirely on screen without scrolling (h-screen layout, compact aspect ratios)
  - ✅ **Enhanced Interactions**: 3D card hovers, animated icons, staggered reveals, spring animations
  - ✅ **Mobile Responsive**: Optimized layouts for all screen sizes (tested 375x667 to 1920x1080)
  - ✅ **Image Loading**: Fixed skeleton/fade-in animation to show on each question transition
  - ✅ Architect-reviewed and e2e tested on desktop and mobile viewports

- **2025-11-17**: Initial Project Launch
  - ✅ Configured Wolt design tokens (turquoise primary, orange secondary)
  - ✅ Built all game components (CategorySelection, Quiz, FinalScore)
  - ✅ Implemented backend JSON parsing (1410 restaurants loaded)
  - ✅ Created robust quiz generation ensuring 4 distinct restaurant options per question
  - ✅ Fixed state management bug (apiRequest .json() parsing)
  - ✅ Complete e2e testing - game flow works flawlessly

## File Structure
```
client/src/
├── pages/
│   ├── home.tsx              # Main game orchestration
│   ├── category-selection.tsx # Category picker screen
│   ├── quiz.tsx              # Quiz gameplay screen
│   └── final-score.tsx       # Results and replay screen
├── components/ui/            # Shadcn components
└── index.css                 # Wolt color tokens

server/
├── routes.ts                 # API endpoints (to be implemented)
└── storage.ts                # In-memory game storage

shared/
└── schema.ts                 # TypeScript types and Zod schemas
```

## API Endpoints
- `GET /api/categories` - Returns available food categories with restaurant counts
- `POST /api/game/start` - Starts new game with selected category (or null for all categories), returns GameState with 10 random questions

## User Preferences
- Emphasize visual quality and polish
- Follow Wolt's modern, clean aesthetic
- Maintain smooth, engaging user experience
- Mobile-first approach for accessibility
