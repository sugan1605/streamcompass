<p align="center">
  <img width="80%" src="https://github.com/user-attachments/assets/c654839f-edcb-48a1-a5b0-d7d5b81c8ef2" />
</p>

<p align="center">AI-ready movie discovery app built with React Native + Express backend</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0D96F6?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TMDB_API-01B4E4?style=for-the-badge&logo=tmdb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
</p>

---

# 🚀 Overview

StreamCompass helps users quickly find what to watch through mood-based recommendations, swipe gestures, detailed movie pages, and a clean, scalable architecture.

Built as a **production-style portfolio project**, demonstrating:

- Modern React Native architecture  
- TypeScript everywhere  
- Firebase authentication + cloud sync  
- TMDB-powered search  
- Backend API with Express + OpenAI (AI-ready)  
- Polished UI system with reusable Tailwind components  

---

# 🚀 Features

## 🎭 Mood-Based Home Dashboard
- Select *who* you're watching with  
- Choose *mood filters*  
- Smart tailored suggestions  

## 🔍 Real TMDB Search
- Instant search with TMDB API  
- Debounced queries  
- Voice search UI prepared (requires dev build)  

## 🔥 Swipe Interactions
- **Swipe left** → remove from watchlist  
- **Swipe right** → add to watchlist  
- Includes glow, bounce, and haptic animations  

## 🎥 Movie Details
- Cast  
- Similar titles  
- Streaming providers  
- Trailer integration (YouTube)  

## ⭐ Watchlist
- Add/remove movies  
- Undo dialog  
- Firestore-synced state  

## 🤖 AI-Ready Features
- UI for AI summaries + AI movie picks  
- Backend Express server includes OpenAI client  
- AI disabled until paid API key activation  

## 🌓 Clean UI & Theming
- NativeWind (Tailwind CSS)  
- Dark/light theme  
- Consistent UI and spacing  

## 🧩 Reusable Component System
- Shared button system  
- Custom dialog system  
- Movie cards, swipe rows, filters  
- Senior-level modular architecture  

---

# 📁 Folder Structure (Monorepo)

stream_compass_app/
├── frontend/ # React Native Expo app
│ ├── app/
│ ├── src/
│ ├── assets/
│ └── ...
├── backend/ # Express + TypeScript API
│ ├── src/
│ │ ├── index.ts
│ │ ├── openaiClient.ts
│ │ └── routes/
│ └── tsconfig.json
├── README.md
└── CHANGELOG.md

---

# 📦 Tech Stack

## Frontend
- React Native (Expo)
- Expo Router
- TypeScript
- NativeWind (Tailwind CSS)
- Firebase Auth + Firestore
- TMDB API

## Backend
- Node.js + Express
- TypeScript
- OpenAI API Client
- CORS + dotenv

## Tooling
- EAS (native builds)
- GitHub Monorepo
- Reusable UI Component System

---

# 📸 Screenshots (Coming Soon)

<p align="center">
  <img src="assets/screenshots/home.png" width="30%" />
  <img src="assets/screenshots/details.png" width="30%" />
  <img src="assets/screenshots/watchlist.png" width="30%" />
</p>

---

# 🧑‍💻 Running the Project

## 📱 Frontend (React Native)

- cd stream_compass_app/frontend
- npm install
- npx expo start
- i   # iOS Simulator
- a   # Android Emulator

  
## 🖥️ Backend (Express + TypeScript)

- cd stream_compass_app/backend
- npm install
- npm run dev
- Server runs at: http://localhost:3000

## Required environment variables: 

- OPENAI_API_KEY=your_key


## 🚧 Upcoming Features

- Full AI Picks integration

- In-app trailer playback (YouTube API)

- Offline mode

- Genre + cast + year search filters

- Local caching for performance improvements

## 📝 CHANGELOG & Releases
- See [CHANGELOG.md] / Contains version updates and development notes. (https://github.com/sugan1605/streamcompass/blob/main/CHANGELOG.md)

## 👤 Author

* Losugan Sivasuthan
* React Native / Fullstack Developer — specialized in frontend and UX/UI
* LinkedIn: https://www.linkedin.com/in/sugan1605/
* Email: ssv1605@outlook.com
