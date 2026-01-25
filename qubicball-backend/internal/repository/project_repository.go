package repository

import (
	"context"

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
	return r.db.WithContext(ctx).Model(project).Updates(project).Error
}

func (r *projectRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Project{}, id).Error
}
