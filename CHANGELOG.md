# 📌 CHANGELOG

All notable changes to **StreamCompass** will be documented in this file.  
This project follows a simplified semantic versioning approach.

---

## v1.7 – Animated Splash Screen + SVG Logo Upgrade

### Added
- New animated splash screen (compass spin + pulse + wiggle)
- Replaced PNG logo with vector SVG React component (`StreamCompassLogo`)
- Performance improvements in splash animation timing

### Fixed
- Removed ThemeContext dependency from splash screen
- Improved progress bar smoothness

---

## **v1.6 – Monorepo Restructure & Backend Integration**  
**Released:** 2025-12-07  

### Added
- Implemented complete monorepo structure (`frontend/` + `backend/`)
- Added backend Express API with TypeScript
- Connected OpenAI client (AI-ready)
- Added clean initial backend architecture (`routes/`, `openaiClient.ts`, `index.ts`)
- Added root-level README and new project documentation

### Changed
- Cleaned entire Git history (broken nested repos removed)
- Unified project folder structure for production standards
- Updated `.gitignore` rules for monorepo

### Fixed
- Removed accidental nested Git repositories
- Fixed unrelated history issues

---

## **v1.5 – Search System Overhaul**  

### Added
- TMDB-powered global search on Home screen
- New SearchBar component (modern UI)
- TMDB mapping utilities (`tmdbMappers.ts`)
- Loading, error, and empty states

### Improved
- Cleaned TMDB service functions for reusability
- Added comments and documentation

---

## **v1.4 – Watchlist Search & UX Updates**

### Added
- Local search inside Watchlist
- Search filtering with `useMemo`
- Better empty states

### Improved
- Swipe-to-delete UX
- Instant UI updates after deletion

---

## **v1.3 – UI Dialog + Swipe Enhancements**

### Added
- Undo dialog animations
- Shake animation for Undo button
- Auto-dismiss timer
- Haptic feedback on watchlist actions

### Fixed
- Trailer button layout fixes
- Swipe row animation timing issues

---

## **v1.2 – Action Buttons & Reusable Components**

### Added
- New `MovieActionButtons.tsx`
- UIButton variants (outline, gradient, danger)
- Tailwind-styled reusable design system

---

## **v1.1 – Splash Screen, Navigation, Theming**

### Added
- Splash screen with haptic feedback
- Updated bottom tab bar
- Complete NativeWind migration
- TS fixes for Firebase typedefs

---

## **v1.0 – Initial Release**

### Added
- React Native app with Expo Router
- Firebase Auth
- Firestore Watchlist
- Home, AI Picks (UI only), Movie Details, Settings
- Swipe-to-delete on Watchlist
