# Qubicball Frontend

The frontend application for Qubicball, built with Next.js 16 and a modern, responsive UI design.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/) (Icons)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation

## Configuration

Copy the example environment file to create a local configuration:

```bash
cp .env.example .env.local
```

The following environment variables are available:

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (default: `http://localhost:8080/api`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd quicball-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Core design system
│   │   ├── tasks/          # Task-related components
│   │   └── projects/       # Project-related components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & API config
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── package.json            # Project dependencies
```

## Features

- **Authentication**: Login and registration flows.
- **Task Management**: Create, edit, and update tasks.
- **Projects**: Manage projects and assign tasks.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Dark Mode**: Built-in support for light and dark themes.
