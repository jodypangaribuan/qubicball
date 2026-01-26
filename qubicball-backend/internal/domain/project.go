package domain

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"not null" json:"name"`
	Description string         `json:"description"`
	OwnerID     uint           `gorm:"not null" json:"owner_id"`
	Owner       User           `gorm:"foreignKey:OwnerID" json:"owner"`
	Version     int            `gorm:"default:1" json:"version"` // Optimistic Locking
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type ProjectRepository interface {
	Create(ctx context.Context, project *Project) error
	GetByID(ctx context.Context, id uint) (*Project, error)
	GetAll(ctx context.Context, limit, offset int) ([]Project, error)
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, id uint) error
}

type ProjectUsecase interface {
	Create(ctx context.Context, project *Project) error
	GetByID(ctx context.Context, id uint) (*Project, error)
	GetAll(ctx context.Context, page, pageSize int) ([]Project, error)
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, id uint) error
}
