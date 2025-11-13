# Personal Finance Tracker — Frontend

React + Material UI + TypeScript frontend built with Vite. Designed to be fast, accessible and PWA-ready.

## Features

- Track income and expenses
- Set and monitor financial goals
- Visualize financial data with charts
- Multi-language support
- Dark-Light Theme
- Responsive design
- PWA support

What’s included

- Pages: Dashboard, Transactions, Login, Signup, Not Found
- Components: charts, transaction forms, layout, snackbar/toasts, theme toggle
- State: Redux Toolkit + React Query for server state
- i18n: `react-i18next` with language files under `public/locales`
- Tests: Vitest (unit) and Playwright (E2E)

Prerequisites

- Node.js >=16
- npm

Environment

- The project reads runtime variables from `.env` or the environment. Key variables:
    - `VITE_API_BASE_URL` — the backend API base URL (e.g., `http://localhost:8080/api`)

Quick start (development)

```pwsh
cd frontend
npm install
npm run dev
```

Vite will print the dev URL (usually `http://localhost:5173`). Open it and you should be able to login or use seeded data when the backend is running.

Build for production

```pwsh
cd frontend
npm run build
npm run preview   # preview the production build locally
```

PWA and assets

- Use `npm run generate-pwa-assets` to generate icons and manifest assets before building for production.

Testing

- Unit tests (Vitest): `npm run test`
- UI mode (Vitest with UI): `npm run test:ui`
- E2E (Playwright): `npm run e2e`

Linting & formatting

- ESLint: `npm run lint`
- Stylelint (CSS): `npm run lint:css`
- Prettier: `npm run format`

Key files and folders

- `src/pages` — application pages (Dashboard, Transactions, Login, Signup)
- `src/components` — shared UI components and forms
- `src/api` — api clients (axios wrapper, endpoints)
- `src/store` — Redux store slices and providers
- `public/locales` — translation files for supported languages

Deployment

- Build using `npm run build` and serve the `dist`
- `nginx.conf` is provided as example for containerized deployments.

Useful npm scripts

- `dev` — start Vite dev server.
- `build` — typecheck + build.
- `preview`: Preview the production build.
- `typecheck`: Run TypeScript type checking.
- `generate-pwa-assets`: Generate PWA assets.
- `test:watch`: Run tests in watch mode.
- `test:coverage`: Run tests with coverage reporting.
- `e2e:headed`: Run end-to-end tests in headed mode.
- `e2e:ui`: Show the end-to-end test report.
- `i18n:extract`: Extract the translation keys.
- `i18n:types`: Generate the translation types.
- `commit`: Prompt for commit message.

Accessibility & Internationalization

- Project includes `@axe-core/react` during dev for accessibility checks.
- Language resources are under `public/locales` and extracted with `i18next-cli` scripts in `package.json`.
