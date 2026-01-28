# Qubicball

Qubicball is a modern task and project management tool designed to streamline team collaboration. It features a robust backend written in Go and a dynamic frontend built with Next.js.

## Architecture

The project is structured as a monorepo with the following components:

- **Frontend (`quicball-frontend`)**: A responsive web application built with [Next.js 16](https://nextjs.org/), styled with [Tailwind CSS v4](https://tailwindcss.com), and using [Zustand](https://github.com/pmndrs/zustand) for state management.
- **Backend (`qubicball-backend`)**: A high-performance REST API built with [Go](https://go.dev/) and [Gin](https://gin-gonic.com/).

```
.
├── qubicball-backend/   # Backend service (Go/Gin)
├── quicball-frontend/   # Frontend application (Next.js)
├── docker-compose.yml   # Root service orchestration
└── README.md            # Project documentation
```

- **Infrastructure**:
    - **PostgreSQL**: Primary relational database.
    - **Redis**: Used for caching and session management.
    - **Docker**: Containerization for easy development and deployment.

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Go](https://go.dev/) (v1.24+)

### Running the Project

#### 1. Start the Backend & Infrastructure

Navigate to the backend directory and start the services using Docker Compose:

```bash
cd qubicball-backend
cp .env.example .env
docker-compose up --build
```

This will start the Go backend server (port 8080), PostgreSQL (port 5432), and Redis (port 6379).

#### 2. Start the Frontend

Open a new terminal, navigate to the frontend directory, install dependencies, and run the development server:

```bash
cd quicball-frontend
cp .env.example .env.local
npm install
npm run dev
```

The application should now be accessible at [http://localhost:3000](http://localhost:3000).

## License

[MIT](LICENSE)
