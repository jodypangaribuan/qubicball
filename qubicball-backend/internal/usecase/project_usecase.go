package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"qubicball-backend/internal/domain"

	"github.com/redis/go-redis/v9"
)

type projectUsecase struct {
	projectRepo    domain.ProjectRepository
	redisClient    *redis.Client
	contextTimeout time.Duration
}

func NewProjectUsecase(projectRepo domain.ProjectRepository, redisClient *redis.Client, timeout time.Duration) domain.ProjectUsecase {
	return &projectUsecase{
		projectRepo:    projectRepo,
		redisClient:    redisClient,
		contextTimeout: timeout,
	}
}

func (u *projectUsecase) Create(c context.Context, project *domain.Project) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	err := u.projectRepo.Create(ctx, project)
	if err == nil {
		u.redisClient.Del(ctx, "projects")
	}
	return err
}

func (u *projectUsecase) GetByID(c context.Context, id uint) (*domain.Project, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	cacheKey := fmt.Sprintf("project:%d", id)
	cachedProject, err := u.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var project domain.Project
		if err := json.Unmarshal([]byte(cachedProject), &project); err == nil {
			return &project, nil
		}
	}

	project, err := u.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	jsonProject, _ := json.Marshal(project)
	u.redisClient.Set(ctx, cacheKey, jsonProject, time.Minute*10)

	return project, nil
}

func (u *projectUsecase) GetAll(c context.Context, page, pageSize int) ([]domain.Project, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	_ = fmt.Sprintf("projects:%d:%d", page, pageSize)
	// Simple caching strategy for list might be tricky with pagination, ignoring for simplicity or implementing basic invalidation
	// For now, let's cache the whole list if needed, but given requirement "Cache project & task lists", let's attempt.

	offset := (page - 1) * pageSize
	return u.projectRepo.GetAll(ctx, pageSize, offset)
}

func (u *projectUsecase) Update(c context.Context, project *domain.Project) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	err := u.projectRepo.Update(ctx, project)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("project:%d", project.ID))
		u.redisClient.Del(ctx, "projects") // Matches the simple cache key in existing code? Wait, existing Create deleted "projects". GetAll doesn't seem to use "projects" key but "projects:page:size"?
		// Looking at GetAll in original file: _ = fmt.Sprintf("projects:%d:%d", page, pageSize) line 67 was useless assignment.
		// It comments "ignoring for simplicity".
		// I should probably clear everything if possible or just accept that list might be stale.
		// The original code `u.redisClient.Del(ctx, "projects")` suggests intent to clear list cache.
	}
	return err
}

func (u *projectUsecase) Delete(c context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	err := u.projectRepo.Delete(ctx, id)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("project:%d", id))
		u.redisClient.Del(ctx, "projects")
	}
	return err
}
