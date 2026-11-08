# FreshLoop

FreshLoop is a React Native (Expo) mobile app for reducing household food waste. It gives households a smart pantry, AI-style recipe suggestions, a meal planner, expiry reminders, a donation hub for surplus food, and a chatbot. Separate role-based experiences are provided for businesses, NPO coordinators, and platform administrators.

## Project Overview

- **What it does:** Tracks pantry items and expiry dates, suggests recipes from available ingredients, plans meals, surfaces waste analytics, and connects food donors with recipients. Businesses can schedule donations and pickups; NPO coordinators manage pickups, an operations map, distribution ledgers, and handoff scanning; admins manage verification, moderation, broadcasts, accounts, and platform health.
- **Who it is for:** General/home users, food businesses, NPO coordinators, and FreshLoop administrators.
- **Current maturity:** This is a front-end prototype. Screens render seeded/mock data, and authentication plus sessions are stored locally on the device. There is no backend or network API in the repository.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Framework | React Native 0.81.5 + Expo SDK 54 |
| UI | React 19.1.0, NativeWind 2 (Tailwind for React Native), `@expo/vector-icons` (Feather) |
| Navigation | React Navigation 7 (`native-stack`, `bottom-tabs`) |
| Storage | `@react-native-async-storage/async-storage` |
| Device APIs | `expo-local-authentication` (biometrics) |
| Build tooling | Babel (`babel-preset-expo`), TypeScript 5.9, Tailwind CSS 3 |

Declared dependencies and scripts live in `package.json`. App metadata (name, slug, icons, splash, new architecture flag) lives in `app.json`. Tailwind brand colors are defined in `tailwind.config.js`.

## How It Works / Architecture

```
FreshLoop/
├── App.tsx                     # Wraps app in AuthProvider + RootNavigator
├── index.ts                    # Expo entry point (registerRootComponent)
├── app.json                    # Expo app configuration
├── babel.config.js             # Expo preset + nativewind/babel plugin
├── tailwind.config.js          # Brand colors and content globs
├── context/
│   ├── AuthContext.tsx         # Session state, restore, sign-out
│   └── SignOutContext.tsx      # Sign-out callback for nested screens
├── navigation/
│   ├── RootNavigator.tsx       # Chooses landing/auth/role navigator from session
│   ├── HomeUserNavigator.tsx   # Dashboard, Pantry, Recipes, Plan, FreshBot, Donate
│   ├── BusinessUserNavigator.tsx # Dashboard, Donate, Pickups, History, Profile
│   ├── NPOUserNavigator.tsx    # Pickups, Map, Ledger, Scanner, Profile
│   └── AdminUserNavigator.tsx  # Health, Verify, Moderate, Broadcast, Security, Admins
├── screens/
│   ├── auth/                   # Landing + separate login/registration per role
│   ├── general_user/           # Pantry, recipes, meal planner, FreshBot, donation hub...
│   ├── business_user/          # Analytics, donations, pickups, history, profile...
│   ├── npo_user/               # Active pickups, map, ledger, scanner, profile...
│   └── admin_user/             # Verification, moderation, broadcasts, accounts...
├── services/
│   └── authService.ts          # Local user store, sessions, biometric helpers
├── components/
│   ├── CustomHeader.tsx
│   └── RecipeModal.tsx
└── assets/                     # App icons, splash, logo
```

### Startup and navigation flow

1. `index.ts` registers `App`; `App.tsx` wraps everything in `AuthProvider` and renders `RootNavigator`.
2. `AuthContext` restores a persisted session from AsyncStorage on launch.
3. `RootNavigator` shows the landing screen, then routes to the login flow for the chosen role (`home`, `business`, `npo`, `admin`).
4. A successful login stores an `AuthSession` and switches to the matching role navigator. Each role navigator is a bottom-tab navigator nested inside a native stack for secondary screens (notifications, profile, security, report, settings).

### Authentication model

`services/authService.ts` implements a local, offline auth store:

- Users are saved under the AsyncStorage key `freshloop_users`; the active session under `freshloop_session`.
- Supported roles: `home`, `business`, `npo`, `admin`.
- Home users are created with status `active`; business and NPO registrations start as `pending`.
- Passwords must be at least 8 characters and are stored in plain text in AsyncStorage.
- Admin sign-in uses a hard-coded admin account defined in `services/authService.ts`. This is demo-only and should be replaced before any real deployment.
- Biometric enrollment uses `expo-local-authentication` and flips a `biometricEnabled` flag on the stored user/session.

### Screen data

The screens under `screens/` use local constants for demo content (for example `RECIPES`, `INITIAL_ITEMS`, `LISTINGS`, `STATIC_MESSAGES`, and admin `PENDING_APPLICATIONS`). Profile images use the `ui-avatars.com` placeholder service; admin verification documents use `placehold.co` placeholders.

## Prerequisites & Environment Variables

### Required tools

- Node.js 18 LTS or newer (Node 20+ recommended for Expo SDK 54)
- npm (a `package-lock.json` is committed) or a compatible package manager
- One of:
  - [Expo Go](https://expo.dev/go) on a physical iOS/Android device
  - Android Studio emulator / Xcode iOS simulator
- Optional: Expo account/EAS CLI for native builds

### Environment variables

No environment variables are referenced by the source code. There is no `.env` file and no `EXPO_PUBLIC_*` usage. All behaviour is local and configuration lives in `app.json`, `package.json`, and `tailwind.config.js`.

> **Setup note:** admin credentials are hard-coded in `services/authService.ts` rather than supplied via environment variables. Treat them as demo values and change them before publishing a build.

## Getting Started

All commands are run from the repository root (the folder containing `package.json`).

### 1. Install dependencies

```powershell
npm install
```

### 2. Start the Expo development server

```powershell
npm start
```

or directly:

```powershell
npx expo start
```

### 3. Open the app

- Scan the QR code with Expo Go on a device, or
- Press `a` for an Android emulator, `i` for the iOS simulator, or `w` for web.

The scripts defined in `package.json` are:

| Command | Action |
| --- | --- |
| `npm start` | `expo start` |
| `npm run android` | `expo start --android` |
| `npm run ios` | `expo start --ios` |
| `npm run web` | `expo start --web` |

### 4. Sign in / register

- Choose a role on the landing screen.
- Home users can self-register and then optionally enable biometrics during onboarding.
- Business and NPO users self-register and are stored with `pending` status.
- Admin sign-in uses the demo admin account defined in `services/authService.ts`.

### Type-check

```powershell
npx tsc --noEmit
```

## Known Limitations

- No backend, API client, or database: all data is local/mock and does not sync between devices.
- Passwords are stored in plain text in AsyncStorage; this is not production-grade authentication.
- Admin credentials are hard-coded in the source.
- Several screens are UI prototypes driven by constants rather than live data.
- Biometrics require a physical device or emulator with enrolled biometrics.
