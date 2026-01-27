package domain

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleManager Role = "manager"
	RoleMember  Role = "member"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Name      string         `gorm:"not null" json:"name"`
	Role      Role           `gorm:"type:varchar(20);default:'member'" json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByID(ctx context.Context, id uint) (*User, error)
	GetAll(ctx context.Context) ([]User, error)
}

type UserUsecase interface {
	Register(ctx context.Context, user *User) error
	Login(ctx context.Context, email, password string) (*User, string, error)
	GetProfile(ctx context.Context, id uint) (*User, error)
	GetAllUsers(ctx context.Context) ([]User, error)
}
