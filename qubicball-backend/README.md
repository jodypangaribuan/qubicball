# Qubicball Backend

The backend service for Qubicball, a task management application. This service is built with Go using the Gin framework and follows a clean architecture pattern.

## Tech Stack

- **Language**: [Go](https://go.dev/) (1.24+)
- **Framework**: [Gin](https://gin-gonic.com/)
- **Database**: PostgreSQL
- **ORM**: [GORM](https://gorm.io/)
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Configuration**: godotenv

## Configuration

The application uses environment variables for configuration. Copy the example `.env` file to create a local configuration:
```bash
cp .env.example .env
```
Or create a `.env` file in the root of the backend directory with the following variables:

```env
# Server
PORT=8080

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=qubicball
DB_PORT=5432

# Redis
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=

# Security
JWT_SECRET=your_jwt_secret_key
cors_allowed_origins=http://localhost:3000
```

> [!IMPORTANT]
> Change the `JWT_SECRET` and database credentials in production environments.

## Development

### Running Locally

1.  **Start Dependencies**: Ensure PostgreSQL and Redis are running. You can use Docker for this:
    ```bash
    docker-compose up db redis -d
    ```

2.  **Run the Server**:
    ```bash
    go run ./cmd/api
    ```
    The server will start on `http://localhost:8080`.

### Running with Docker

To run the entire backend stack (API, Postgres, Redis) using Docker Compose:

```bash
docker-compose up --build
```

## Project Structure

```
.
├── cmd/
│   └── api/                # Application entry point
├── internal/
│   ├── delivery/           # HTTP handlers & router
│   ├── domain/             # Core business models
│   ├── infrastructure/     # Database & external services
│   ├── repository/         # Data access layer
│   └── usecase/            # Business logic
├── docs/                   # Documentation resources
├── .env                    # Environment configuration
├── docker-compose.yml      # Service orchestration
└── go.mod                  # Go module definition
```

## API Documentation

API endpoints are exposed via HTTP. Refer to the router (`internal/delivery/http/router.go`) for a complete list of endpoints.
