package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"qubicball-backend/internal/domain"

	"github.com/redis/go-redis/v9"
)

type taskUsecase struct {
	taskRepo       domain.TaskRepository
	redisClient    *redis.Client
	contextTimeout time.Duration
}

func NewTaskUsecase(taskRepo domain.TaskRepository, redisClient *redis.Client, timeout time.Duration) domain.TaskUsecase {
	return &taskUsecase{
		taskRepo:       taskRepo,
		redisClient:    redisClient,
		contextTimeout: timeout,
	}
}

func (u *taskUsecase) Create(c context.Context, task *domain.Task) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	err := u.taskRepo.Create(ctx, task)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", task.ProjectID))
	}
	return err
}

func (u *taskUsecase) GetByID(c context.Context, id uint) (*domain.Task, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	return u.taskRepo.GetByID(ctx, id)
}

func (u *taskUsecase) GetByProjectID(c context.Context, projectID uint) ([]domain.Task, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	cacheKey := fmt.Sprintf("tasks:project:%d", projectID)
	cachedTasks, err := u.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var tasks []domain.Task
		if err := json.Unmarshal([]byte(cachedTasks), &tasks); err == nil {
			return tasks, nil
		}
	}

	tasks, err := u.taskRepo.GetByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	jsonTasks, _ := json.Marshal(tasks)
	u.redisClient.Set(ctx, cacheKey, jsonTasks, time.Minute*5)

	return tasks, nil
}

func (u *taskUsecase) Update(c context.Context, task *domain.Task) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	// 1. Fetch existing task
	existingTask, err := u.taskRepo.GetByID(ctx, task.ID)
	if err != nil {
		return err
	}

	// 2. Merge changes (only update non-zero or specific fields)
	if task.Title != "" {
		existingTask.Title = task.Title
	}
	if task.Description != "" {
		existingTask.Description = task.Description
	}
	if task.Status != "" {
		existingTask.Status = task.Status
	}
	// Check if DueDate is not zero time
	if !task.DueDate.IsZero() {
		existingTask.DueDate = task.DueDate
	}
	if task.AssigneeID != nil {
		existingTask.AssigneeID = task.AssigneeID
	}
	// Update version for optimistic locking
	existingTask.Version = task.Version

	err = u.taskRepo.Update(ctx, existingTask)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", existingTask.ProjectID))
		// If the project ID changed (unlikely in this app flow but possible), invalidate old one too
		if existingTask.ProjectID != task.ProjectID && task.ProjectID != 0 {
			u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", task.ProjectID))
		}
		// Update the pointer so the handler gets the updated data back
		*task = *existingTask
	}
	return err
}

func (u *taskUsecase) Delete(c context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	existingTask, err := u.taskRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	err = u.taskRepo.Delete(ctx, id)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", existingTask.ProjectID))
	}
	return err
}

func (u *taskUsecase) MarkOverdueTasks(c context.Context) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	// 1. Get potentially affecting projects for cache invalidation
	// This is a "best effort" invalidation.
	tasks, err := u.taskRepo.GetOverdueTasks(ctx)
	if err != nil {
		return err
	}

	projectIDs := make(map[uint]bool)
	for _, task := range tasks {
		projectIDs[task.ProjectID] = true
	}

	// 2. Perform Atomic Update
	if err := u.taskRepo.MarkAsOverdue(ctx); err != nil {
		return err
	}

	// 3. Invalidate Caches
	for projectID := range projectIDs {
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", projectID))
	}

	return nil
}

func (u *taskUsecase) GetByAssigneeID(c context.Context, assigneeID uint) ([]domain.Task, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	return u.taskRepo.GetByAssigneeID(ctx, assigneeID)
}

func (u *taskUsecase) GetByProjectIDAndAssigneeID(c context.Context, projectID uint, assigneeID uint) ([]domain.Task, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	// Invalidate Project Cache? No, this is a read.
	// Cache can be tricky here. For now, bypass cache or use specific key.
	// Given the specific requirement, fetching from DB is safer to ensure privacy.
	return u.taskRepo.GetByProjectIDAndAssigneeID(ctx, projectID, assigneeID)
}
