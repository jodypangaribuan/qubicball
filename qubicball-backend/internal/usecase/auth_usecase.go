package usecase

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"qubicball-backend/internal/domain"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type authUsecase struct {
	userRepo       domain.UserRepository
	contextTimeout time.Duration
}

func NewAuthUsecase(userRepo domain.UserRepository, timeout time.Duration) domain.UserUsecase {
	return &authUsecase{
		userRepo:       userRepo,
		contextTimeout: timeout,
	}
}

func (u *authUsecase) Register(c context.Context, user *domain.User) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	_, err := u.userRepo.GetByEmail(ctx, user.Email)
	if err == nil {
		return errors.New("email already exists")
	}
	// We expect an error here (RecordNotFound). If it's another error, we might want to return it,
	// but for simplicity assuming if err != nil it means not found or db error, preventing duplicate is main goal.
	// Ideally check if err != gorm.ErrRecordNotFound. But let's stick to standard practice:
	// If err == nil, it means query succeeded and found a user -> conflict.

	// Debug log
	log.Printf("Registering user: %s. Password to hash: %s\n", user.Email, user.Password)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return u.userRepo.Create(ctx, user)
}

func (u *authUsecase) Login(c context.Context, email, password string) (*domain.User, string, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	user, err := u.userRepo.GetByEmail(ctx, email)
	if err != nil {
		log.Printf("Login check: User not found for email %s: %v\n", email, err)
		return nil, "", errors.New("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Printf("Login check: Password mismatch for user %s. Stored: %s, Input: %s. Error: %v\n", email, user.Password, password, err)
		return nil, "", errors.New("invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, "", err
	}

	return user, tokenString, nil
}

func (u *authUsecase) GetProfile(c context.Context, id uint) (*domain.User, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	return u.userRepo.GetByID(ctx, id)
}
func (u *authUsecase) GetAllUsers(c context.Context) ([]domain.User, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	return u.userRepo.GetAll(ctx)
}
