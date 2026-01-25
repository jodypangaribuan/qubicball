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

	err := u.taskRepo.Update(ctx, task)
	if err == nil {
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", task.ProjectID))
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

	tasks, err := u.taskRepo.GetOverdueTasks(ctx)
	if err != nil {
		return err
	}

	for _, task := range tasks {
		task.Status = domain.TaskStatusOverdue
		if err := u.taskRepo.Update(ctx, &task); err != nil {
			// Log error but continue
			fmt.Printf("Failed to update overdue task %d: %v\n", task.ID, err)
			continue
		}
		// Invalidate cache for the project
		u.redisClient.Del(ctx, fmt.Sprintf("tasks:project:%d", task.ProjectID))
	}
	return nil
}

func (u *taskUsecase) GetByAssigneeID(c context.Context, assigneeID uint) ([]domain.Task, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	return u.taskRepo.GetByAssigneeID(ctx, assigneeID)
}
