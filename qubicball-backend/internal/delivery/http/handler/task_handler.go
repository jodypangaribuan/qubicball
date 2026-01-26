package handler

import (
	"errors"
	"net/http"
	"strconv"

	"qubicball-backend/internal/domain"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskHandler struct {
	TaskUsecase domain.TaskUsecase
}

func (h *TaskHandler) Create(c *gin.Context) {
	var task domain.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.TaskUsecase.Create(c.Request.Context(), &task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) GetByProjectID(c *gin.Context) {
	projectID, _ := strconv.Atoi(c.Param("project_id"))
	tasks, err := h.TaskUsecase.GetByProjectID(c.Request.Context(), uint(projectID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var task domain.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task.ID = uint(id)

	if err := h.TaskUsecase.Update(c.Request.Context(), &task); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusConflict, gin.H{"error": "Task modified by another user or not found. Please refresh and try again."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.TaskUsecase.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}
func (h *TaskHandler) GetByAssigneeID(c *gin.Context) {
	// Usually invalid param would be 0, or check error
	assigneeID, _ := strconv.Atoi(c.Param("assignee_id"))
	// If assignee_id is not passed in route, maybe from query or context (me)?
	// Route will be /tasks/assignee/:assignee_id
	tasks, err := h.TaskUsecase.GetByAssigneeID(c.Request.Context(), uint(assigneeID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}
