StreamCompass 🎬

A modern movie discovery and watchlist companion app built using React Native, Expo Router, Firebase, NativeWind, and the TMDB API.

StreamCompass helps you find what to watch through curated suggestions, AI-inspired flows, detailed movie pages, and personalized watchlists. The app focuses on delivering a smooth, premium user experience with a real-world technical stack suitable for a professional developer portfolio.

✨ Milestones Completed
1. Authentication System

Firebase Email/Password Authentication

Persistent session

Clean sign-in UI styled with NativeWind

2. Home Dashboard

“Who & Mood” selector for personalized suggestion inputs

Smooth category buttons (Romantic, Funny, Scary, Chill, Partner, Kids, etc.)

Live suggestion refresh timestamp

“Find something to watch” CTA

Home layout fully polished

3. AI Picks (UI Completed)

Beautiful AI Picks screen

“Try AI Picks ✨” CTA

Messaging for AI errors (e.g., OpenAI not available)

Clean UX for future AI results

OpenAI Note:
AI features are fully implemented in the UI, but live AI recommendations are disabled because OpenAI requires a paid API subscription.

4. Watchlist

Add/remove movies from watchlist

Watchlist page with all saved titles

Swipe-to-delete animation

Smooth red delete icon slide-out

“Removed” confirmation modal

Persistent data synced with Firestore

5. Movie Details Page

A complete, feature-rich screen:

✔ Movie content

Poster banner

Rating badge

Full description

Metadata (genres, duration, year)

✔ AI summary box (UI only)

“Ask AI” button

Description of AI summary usage
(Disabled until OpenAI key is paid)

✔ Cast section

Horizontal list of actors with images

✔ Similar titles section

Scrollable cards with similar movies

✔ Where to watch

Streaming availability tags (Apple TV, Amazon, etc.)

✔ Watchlist actions

Add/remove movie

Confirmation feedback

✔ Trailer Playback

“Play Trailer” button currently opens YouTube

This is intentional

Because the app does not hold trailer licensing/royalty rights, direct in-app playback is not allowed

YouTube is the legal and royalty-safe option for now

(Direct in-app trailer playback may come later using official YouTube APIs.)

6. Navigation

Bottom tab navigation for Home, AI Picks, Watchlist, and Settings

Consistent icons

Fully dark-mode compatible

Smooth transitions

7. Theming

Light/Dark mode with ThemeContext

NativeWind utility styling for consistent UI

Unified color palette across screens

🧪 Testing

The app has been tested on:

Expo Emulator

Xcode iOS Simulator (iPhone 16 Pro Max)

Expo Go on physical devices

🚀 Getting Started
1. Clone the repository
git clone https://github.com/sugan1605/streamcompass.git
cd streamcompass/frontend

2. Install dependencies
npm install

3. Add environment variables

Place a .env file inside /frontend:

EXPO_PUBLIC_TMDB_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_value


✔️ Your .gitignore already prevents .env from being uploaded.

4. Start the project
npx expo start

5. Run on emulator
i   # iOS
a   # Android

📁 Tech Stack

React Native (Expo)

Expo Router

TypeScript

Firebase Auth + Firestore

TMDB API

NativeWind

OpenAI API (planned)

⏳ Upcoming Features (In Progress)

1. Full AI Integration

AI Picks

AI short summaries

Mood-based AI recommendations
(Requires active OpenAI paid key)

2. Local Trailer Player (Future Legal Implementation)

Play trailers inside the app using official APIs

Maintain copyright compliance

3. Enhanced Search System

Search by title, cast, genre, year, or keywords

4. Improved Mood Engine

More dynamic suggestions even without OpenAI

5. Profile & Settings Expansion

Change theme

Language options

Account data management

6. Offline Mode (Optional)

Cache watchlist locally

Cache last-viewed movies and details

📄 License

This app is developed as a personal portfolio project by Losugan Sivasuthan.
Feel free to explore the project code.
Commercial reuse is not permitted.

📬 Contact

Email: ssv1605@outlook.com

GitHub: https://github.com/sugan1605
