package domain

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type TaskStatus string

const (
	TaskStatusNotStarted TaskStatus = "Not Started"
	TaskStatusInProgress TaskStatus = "In Progress"
	TaskStatusCompleted  TaskStatus = "Completed"
	TaskStatusOverdue    TaskStatus = "Overdue"
)

type Task struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	Status      TaskStatus     `gorm:"type:varchar(20);default:'Not Started'" json:"status"`
	DueDate     time.Time      `json:"due_date"`
	ProjectID   uint           `gorm:"not null" json:"project_id"`
	Project     Project        `gorm:"foreignKey:ProjectID" json:"-"`
	AssigneeID  *uint          `json:"assignee_id"`
	Assignee    *User          `gorm:"foreignKey:AssigneeID" json:"assignee,omitempty"`
	Version     int            `gorm:"default:1" json:"version"` // Optimistic Locking
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type TaskRepository interface {
	Create(ctx context.Context, task *Task) error
	GetByID(ctx context.Context, id uint) (*Task, error)
	GetByProjectID(ctx context.Context, projectID uint) ([]Task, error)
	Update(ctx context.Context, task *Task) error
	Delete(ctx context.Context, id uint) error
	GetOverdueTasks(ctx context.Context) ([]Task, error)
	MarkAsOverdue(ctx context.Context) error
	GetByAssigneeID(ctx context.Context, assigneeID uint) ([]Task, error)
}

type TaskUsecase interface {
	Create(ctx context.Context, task *Task) error
	GetByID(ctx context.Context, id uint) (*Task, error)
	GetByProjectID(ctx context.Context, projectID uint) ([]Task, error)
	Update(ctx context.Context, task *Task) error
	Delete(ctx context.Context, id uint) error
	MarkOverdueTasks(ctx context.Context) error
	GetByAssigneeID(ctx context.Context, assigneeID uint) ([]Task, error)
}
