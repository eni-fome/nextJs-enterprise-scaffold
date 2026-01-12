# Next.js Enterprise Scaffold

A production-grade Next.js boilerplate designed for scalability. This repository provides the essential architectural scaffolding and infrastructure for large-scale applications, utilizing current technology standards without imposing specific business logic.

## 🏗️ Architecture

### Core Design Principles

- **Feature-Based Architecture:** Code is organized by business domain (e.g., `auth`, `cart`) rather than file type.
- **Type Safety:** Strict TypeScript configuration and runtime validation for environment variables.
- **Polyglot Support:** Compatibility with npm, pnpm, yarn, and Bun via automated build detection.
- **Modern Standards:** Configured for Next.js 16, React 19, and Tailwind CSS v4.

### Project Structure

```text
src/
├── app/                  # Next.js App Router (Routing layer only)
├── common/               # Shared utilities and hooks
├── components/           # Shared UI primitives (Shadcn/UI)
├── config/               # Global static configuration
├── features/             # Business Logic Domains
│   ├── auth/             # Example Domain
│   │   ├── api/          # Data fetching & mutations
│   │   ├── components/   # Domain-specific UI
│   │   ├── types/        # Domain-specific interfaces
│   │   └── index.ts      # Public API barrier
├── lib/                  # External library configurations (Axios, Query)
├── env.ts                # Environment variable schema definition
└── types/                # Global type definitions
```

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Components:** Shadcn/UI (Headless)
- **State Management:** TanStack Query v5 (Server) & Zustand (Client)
- **Networking:** Axios (Singleton instance with interceptors)
- **Validation:** Zod & @t3-oss/env-nextjs
- **Testing:** Vitest & React Testing Library
- **Quality:** ESLint, Prettier, Husky, Lint-Staged
- **Infrastructure:** Docker (Multi-stage, standalone output)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+) or Bun (v1.0+)
- Git

### Installation

1.  **Create a new project using this template:**

    ```bash
    npx create-next-app -e https://github.com/eni-fome/nextJs-enterprise-scaffold my-app
    cd my-app
    ```

    Or clone directly:

    ```bash
    git clone https://github.com/eni-fome/nextJs-enterprise-scaffold.git my-app
    cd my-app
    npm install
    ```

2.  **Configure Environment:**
    This project uses a typed validation schema (`src/env.ts`) to ensure all required variables are present.

    ```bash
    cp .env.example .env
    ```

    Open `.env` and configure the required keys.
    _Note: The application will throw a build-time error if required keys are missing from `src/env.ts`._

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```

## 🔧 Development Workflow

### Scaffolding New Features

This project includes a generator to maintain folder structure consistency. To create a new feature domain or component:

```bash
npm run generate
```

- **Feature:** Generates `src/features/[name]` with standard subdirectories.
- **Component:** Generates `src/components/common/[name].tsx`.

### Environment Management

We avoid accessing `process.env` directly to prevent runtime errors. Instead, import the validated configuration:

```typescript
// src/some-file.ts
import { env } from "@/env";

const apiUrl = env.NEXT_PUBLIC_API_URL; // Typed and validated
```

### Styling (Tailwind v4)

Theme variables are defined in `src/app/globals.css` using the `@theme` directive, adhering to the Tailwind v4 CSS-first specification.

## 🐳 Docker Support

The included `Dockerfile` is optimized for production using Next.js standalone mode. It includes a polyglot setup script that detects the presence of `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb` and executes the corresponding install command.

**Build and Run:**

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## 🧪 Quality Control

The project enforces code quality via Git hooks (Husky).

- **Pre-commit:** Runs `tsc` (type checking) and `lint-staged`.
- **Linting:** ESLint with strict rules.
- **Formatting:** Prettier.

## 📝 Scripts Reference

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript compiler check

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report

# Scaffolding
npm run generate     # Interactive component/feature generator

# Maintenance
npm run prepare      # Install Husky hooks
```

## ❓ FAQ / Troubleshooting

<details>
<summary><strong>Build fails with "Invalid environment variables" error</strong></summary>

The `src/env.ts` schema is enforcing required variables. Either:

1. Add the missing keys to your `.env` file, or
2. Set `SKIP_ENV_VALIDATION=1` for Docker builds where env vars are injected at runtime.
</details>

<details>
<summary><strong>Tailwind classes not applying (e.g., `bg-primary` not working)</strong></summary>

Ensure the CSS variable is defined in both places:

1. `:root` in `globals.css` (the actual value)
2. `@theme inline` block (the Tailwind mapping)

Example: `--color-primary: var(--primary);` in `@theme` references `--primary` in `:root`.

</details>

<details>
<summary><strong>How do I make API requests?</strong></summary>

Use the pre-configured Axios client:

```typescript
import apiClient from "@/lib/api-client";

const { data } = await apiClient.get("/users");
await apiClient.post("/users", { name: "John" });
```

Base URL is set via `NEXT_PUBLIC_API_URL` in your `.env` file.

</details>

<details>
<summary><strong>Docker build works but container crashes on start</strong></summary>

Check that:

1. `next.config.ts` has `output: "standalone"` set.
2. Required runtime env vars are passed to the container: `docker run -e NEXT_PUBLIC_API_URL=... my-app`
</details>

<details>
<summary><strong>ESLint errors on generated files</strong></summary>

Generated files may have unused variables. Either:

1. Fill in the generated code, or
2. Add `// eslint-disable-next-line` where needed.
</details>

<details>
<summary><strong>How do I write tests?</strong></summary>

Create a `.test.tsx` file next to your component:

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

test('renders correctly', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

Run with `npm run test` or `npm run test:watch` for development.

</details>
