package seeder

import (
	"context"
	"log"
	"qubicball-backend/internal/domain"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Seeder struct {
	UserRepo domain.UserRepository
}

func NewSeeder(userRepo domain.UserRepository) *Seeder {
	return &Seeder{UserRepo: userRepo}
}

func (s *Seeder) SeedUsers() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	users := []domain.User{
		{
			Name:     "Admin User",
			Email:    "admin@qubicball.com",
			Password: "password123",
			Role:     domain.RoleAdmin,
		},
		{
			Name:     "Manager User",
			Email:    "manager@qubicball.com",
			Password: "password123",
			Role:     domain.RoleManager,
		},
		{
			Name:     "Member User",
			Email:    "member@qubicball.com",
			Password: "password123",
			Role:     domain.RoleMember,
		},
	}

	for _, user := range users {
		// Check if user exists
		_, err := s.UserRepo.GetByEmail(ctx, user.Email)
		if err == nil {
			log.Printf("User %s already exists, skipping...", user.Email)
			continue
		}

		// Create user
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Failed to hash password for %s: %v", user.Email, err)
			continue
		}
		user.Password = string(hashedPassword)

		if err := s.UserRepo.Create(ctx, &user); err != nil {
			log.Printf("Failed to seed user %s: %v", user.Email, err)
		} else {
			log.Printf("Seeded user: %s (%s)", user.Email, user.Role)
		}
	}
}
