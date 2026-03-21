# CRUD Vendas Frontend

[🇺🇸 English](./README.en.md) | [🇧🇷 Português](./README.pt-BR.md)

Vue 3 SPA for commercial operations integrated with the `CRUD_LARAVEL` API, including token-based authentication, dashboard indicators, and CRUD modules.

## Summary

- [Overview](#overview)
- [Frontend Objective](#frontend-objective)
- [Architecture and Patterns](#architecture-and-patterns)
- [Technologies and Libraries](#technologies-and-libraries)
- [Folder Structure](#folder-structure)
- [Functional Modules](#functional-modules)
- [Navigation and Request Flow](#navigation-and-request-flow)
- [Authentication and Session](#authentication-and-session)
- [Application Routes](#application-routes)
- [API Integration](#api-integration)
- [How to Run the Project](#how-to-run-the-project)
- [Useful Commands](#useful-commands)
- [Quality and Tooling](#quality-and-tooling)
- [Troubleshooting](#troubleshooting)

## Overview

This project implements the frontend for the CRUD Vendas ecosystem focused on commercial data management.

- Application: `crud-vendas-front`
- Type: Single Page Application (SPA)
- Domain: commercial management and operational records
- Target backend: `CRUD_LARAVEL` (`/api/v1`)
- Integration style: REST + Bearer Token

## Frontend Objective

Provide a web interface for the core API flows:

- login and logout;
- dashboard with aggregated business indicators;
- CRUD for companies, customers, and products;
- user management with fallback to `/auth/me` when `/users` is unavailable;
- public navigation (landing page) and protected internal area.

## Architecture and Patterns

### Responsibility-based architecture

- **Presentation:** Vue pages (`src/pages`) and route navigation.
- **Application:** services that centralize API calls and orchestration logic.
- **Infrastructure:** Axios HTTP client with interceptors and route guards.
- **Bootstrap:** app initialization with Vue, Pinia, and Router.

### Applied frontend patterns

- Frontend Service Layer to encapsulate HTTP integration.
- Clear separation of concerns between page and service.
- Explicit typing for input/output contracts in TypeScript.
- Centralized session/token handling.

## Technologies and Libraries

### Core

- Vue 3
- TypeScript (strict mode)
- Vite
- Vue Router 4
- Pinia

### HTTP Integration

- Axios singleton instance in `src/services/api.ts`
- `baseURL` from `VITE_API_URL`
- Request interceptor with `Authorization: Bearer {token}`
- Response interceptor handling `401`

### Tooling

- ESLint (flat config)
- `vue-tsc` for type-checking
- `@` alias for `src/`

## Folder Structure

```text
src/
├─ pages/
│  ├─ IndexPage.vue
│  ├─ LoginPage.vue
│  ├─ HomePage.vue
│  ├─ CrudCompaniesPage.vue
│  ├─ CrudCustomersPage.vue
│  ├─ CrudProductsPage.vue
│  └─ CrudUsersPage.vue
├─ router/
│  └─ index.ts
├─ services/
│  ├─ api.ts
│  ├─ auth.service.ts
│  ├─ home.service.ts
│  ├─ dashboard.service.ts
│  ├─ companies.service.ts
│  ├─ customers.service.ts
│  ├─ suppliers.service.ts
│  ├─ products.service.ts
│  └─ users.service.ts
├─ styles/
│  └─ main.css
├─ App.vue
└─ main.ts
```

## Functional Modules

### Landing

- Public storefront entry with navigation to login and dashboard.

### Auth

- credential-based authentication;
- token persistence in `localStorage`;
- logout with API revocation and local cleanup.

### Home / Dashboard

- reads `/home`;
- aggregates totals for companies, customers, suppliers, and products;
- shows preview of latest products.

### Companies

- list, create, edit, and delete.

### Customers

- list, create, edit, and delete.

### Products

- list, create, edit, and delete;
- relationship with company and supplier.

### Users

- integration with `/users`;
- fallback to authenticated user when endpoint is unavailable (`404`).

## Navigation and Request Flow

Default flow for a protected operation:

1. User signs in at `/login`.
2. Token is saved in `localStorage` (`crud_vendas_token`).
3. Navigation to internal routes passes through the auth guard.
4. Page triggers an action that calls a service.
5. Service uses `api.ts` to send the request to the API.
6. Response updates the page local state.
7. On `401`, session is cleared and user is redirected to `/login`.

## Authentication and Session

- authentication header:

```bash
Authorization: Bearer {your_token}
```

- current strategy:
  - token stored in `localStorage`;
  - access validation through route guard;
  - automatic redirect on interceptor when session expires.

## Application Routes

### Public

- `/`
- `/login`

### Protected

- `/home`
- `/crud/companies`
- `/crud/customers`
- `/crud/products`
- `/crud/users`

## API Integration

Suggested local base URL:

`http://127.0.0.1:8000/api/v1`

Consumed endpoints:

### Authentication

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

### Home

- `GET /home`

### Companies

- `GET /companies`
- `POST /companies`
- `PUT /companies/{id}`
- `DELETE /companies/{id}`

### Customers

- `GET /customers`
- `POST /customers`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

### Suppliers

- `GET /suppliers` (used to support forms and dashboard)

### Products

- `GET /products`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Users

- `GET /users`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

## How to Run the Project

## Prerequisites

- Node.js LTS
- npm
- `CRUD_LARAVEL` API available

## Installation

1) Install dependencies:

```bash
npm install
```

2) Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3) Set API URL in `.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Development run

Run local application:

```bash
npm run dev
```

## Useful Commands

- Type-check:

```bash
npm run type-check
```

- Lint:

```bash
npm run lint
```

- Auto-fix lint:

```bash
npm run lint:fix
```

- Production build:

```bash
npm run build
```

- Build preview:

```bash
npm run preview
```

## Quality and Tooling

- ESLint for static code analysis.
- Strict TypeScript for type safety.
- `vue-tsc` for typing checks in `.vue` files.
- Alias configuration for cleaner imports.
- Current `package.json` does not include an automated test script.

## Troubleshooting

### 401 on internal routes

- verify token is stored in `localStorage`;
- validate login returned a token;
- check API session/token validity.

### Constant redirect to `/login`

- verify `VITE_API_URL` value;
- confirm backend API availability;
- validate `/api/v1/auth/me` is reachable with Bearer token.

### CORS or API connection failure

- validate backend CORS configuration;
- confirm frontend and backend target correct hosts;
- review port and protocol (`http`/`https`) in `.env`.

### Build or lint failures

- run `npm install` again;
- run `npm run type-check` and `npm run lint` to identify the exact file;
- validate Node.js version compatibility with the project.
