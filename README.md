# Fleetly Frontend

This template should help get you started developing with Vue 3 in Vite.

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next Generation Frontend Tooling
- **Pinia** - Official state management for Vue 3
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **Axios** - HTTP client
- **Vue3-Toastify** - Toast notifications

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Tenant Domains in Local Dev

This workspace supports one domain per tenant in development.

- SIMS Corp: http://sims-corp.localhost:5173
- EcoMove: http://ecomove.localhost:5173

Notes:

- The frontend proxies `/api` to backend and preserves host, so backend resolves tenancy by domain.
- Domain-to-tenant mappings are stored in backend `domains` table.
- `X-Tenant` header is still supported as fallback, but domain routing is preferred.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## State Management with Pinia

This project uses **Pinia** as the official state management solution for Vue 3.

### Stores Available

- **vehicleStore** (`src/stores/vehicleStore.ts`) - Manages vehicles state
  - Actions: `fetchVehicles`, `fetchVehicleById`, `selectVehicle`
  - Getters: `availableVehicles`, `occupiedVehicles`, `runningVehicles`

- **bookingStore** (`src/stores/bookingStore.ts`) - Manages bookings/reservations state
  - Actions: `fetchBookings`, `createBooking`, `updateBooking`, `deleteBooking`, `cancelBooking`, `calculatePrice`
  - Getters: `pendingBookings`, `activeBookings`, `completedBookings`, `cancelledBookings`

### Why Pinia?

- ✅ Official Vue 3 state management
- ✅ Better TypeScript support
- ✅ Simpler API with less boilerplate
- ✅ Composition API ready
- ✅ Automatic modules without registration
- ✅ Lightweight and performance optimized
