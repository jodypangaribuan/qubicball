package repository

import (
	"context"
	"time"

	"qubicball-backend/internal/domain"

	"gorm.io/gorm"
)

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) domain.TaskRepository {
	return &taskRepository{db}
}

func (r *taskRepository) Create(ctx context.Context, task *domain.Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *taskRepository) GetByID(ctx context.Context, id uint) (*domain.Task, error) {
	var task domain.Task
	err := r.db.WithContext(ctx).Preload("Assignee").First(&task, id).Error
	return &task, err
}

func (r *taskRepository) GetByProjectID(ctx context.Context, projectID uint) ([]domain.Task, error) {
	var tasks []domain.Task
	err := r.db.WithContext(ctx).Where("project_id = ?", projectID).Preload("Assignee").Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) Update(ctx context.Context, task *domain.Task) error {
	return r.db.WithContext(ctx).Model(task).Updates(task).Error
}

func (r *taskRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Task{}, id).Error
}

func (r *taskRepository) GetOverdueTasks(ctx context.Context) ([]domain.Task, error) {
	var tasks []domain.Task
	now := time.Now()
	err := r.db.WithContext(ctx).Where("due_date < ? AND status != ?", now, domain.TaskStatusCompleted).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) GetByAssigneeID(ctx context.Context, assigneeID uint) ([]domain.Task, error) {
	var tasks []domain.Task
	err := r.db.WithContext(ctx).Where("assignee_id = ?", assigneeID).Preload("Assignee").Find(&tasks).Error
	return tasks, err
}
