package repository

import (
	"context"
	"time"

	"qubicball-backend/internal/domain"

	"gorm.io/gorm"
)

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) domain.ProjectRepository {
	return &projectRepository{db}
}

func (r *projectRepository) Create(ctx context.Context, project *domain.Project) error {
	return r.db.WithContext(ctx).Create(project).Error
}

func (r *projectRepository) GetByID(ctx context.Context, id uint) (*domain.Project, error) {
	var project domain.Project
	err := r.db.WithContext(ctx).Preload("Owner").First(&project, id).Error
	return &project, err
}

func (r *projectRepository) GetAll(ctx context.Context, limit, offset int) ([]domain.Project, error) {
	var projects []domain.Project
	err := r.db.WithContext(ctx).Limit(limit).Offset(offset).Preload("Owner").Find(&projects).Error
	return projects, err
}

func (r *projectRepository) Update(ctx context.Context, project *domain.Project) error {
	// Optimistic Locking: Check version
	result := r.db.WithContext(ctx).Model(&domain.Project{}).
		Where("id = ? AND version = ?", project.ID, project.Version).
		Updates(map[string]interface{}{
			"name":        project.Name,
			"description": project.Description,
			"version":     project.Version + 1,
			"updated_at":  time.Now(),
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Or a custom ErrConcurrentUpdate
	}
	return nil
}

func (r *projectRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Project{}, id).Error
}
