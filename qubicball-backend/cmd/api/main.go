package main

import (
	"context"
	"log"
	"os"
	"time"

	"qubicball-backend/internal/delivery/http"
	"qubicball-backend/internal/delivery/http/handler"
	"qubicball-backend/internal/infrastructure"
	"qubicball-backend/internal/repository"
	"qubicball-backend/internal/seeder"
	"qubicball-backend/internal/usecase"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default/server environment variables")
	}

	// Infrastructure
	db := infrastructure.NewDatabase()
	redisClient := infrastructure.NewRedisClient()

	// Repository
	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)

	// Usecase
	timeoutContext := time.Duration(5) * time.Second
	authUsecase := usecase.NewAuthUsecase(userRepo, timeoutContext)
	projectUsecase := usecase.NewProjectUsecase(projectRepo, redisClient, timeoutContext)
	taskUsecase := usecase.NewTaskUsecase(taskRepo, redisClient, timeoutContext)

	// Seeding
	log.Println("Seeding database...")
	seeder.NewSeeder(userRepo).SeedUsers()

	// Handlers
	authHandler := &handler.AuthHandler{UserUsecase: authUsecase}
	projectHandler := &handler.ProjectHandler{ProjectUsecase: projectUsecase}
	taskHandler := &handler.TaskHandler{TaskUsecase: taskUsecase}

	// Router & Middleware
	r := gin.Default()
	r.Use(http.CORSMiddleware())

	middleware := http.NewMiddleware(redisClient)

	http.NewRouter(r, middleware, authHandler, projectHandler, taskHandler)

	// Scheduler
	c := cron.New()
	_, err := c.AddFunc("@every 10m", func() {
		log.Println("Running Scheduler: Checking overdue tasks")
		ctx := requestContext()
		if err := taskUsecase.MarkOverdueTasks(ctx); err != nil {
			log.Printf("Error marking overdue tasks: %v", err)
		}
	})
	if err != nil {
		log.Fatal("Error adding cron job:", err)
	}
	c.Start()

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// Helper to get context for background jobs
func requestContext() context.Context {
	return context.Background()
}
