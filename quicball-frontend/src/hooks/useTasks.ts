import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Task, TaskStatus } from '@/types';
import { toast } from 'sonner';

export const useTasks = (projectId: number) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: async () => {
            const { data } = await api.get<{ data: Task[] }>(`/tasks/project/${projectId}`);
            // Based on router: tasks.GET("/project/:project_id", taskHandler.GetByProjectID)
            return data;
        },
        enabled: !!projectId,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask: { title: string; description: string; project_id: number; due_date?: string }) => {
            return api.post('/tasks', newTask);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.project_id] });
            toast.success('Task created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create task');
            console.error(error);
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (task: { id: number; status?: TaskStatus; version: number; title?: string; description?: string; due_date?: Date; assignee_id?: number }) => {
            return api.put(`/tasks/${task.id}`, task);
        },
        onSuccess: (_, variables) => {
            // We need path to invalidate properly. We might not know project_id here easily unless we pass it or return it.
            // Invalidate all tasks queries for safety/simplicity or pass context.
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated');
        },
        onError: (error: any, variables) => {
            if (error.response?.status === 409) {
                toast.error('Data conflict! The task was modified by someone else. Reloading...');
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
            } else {
                toast.error('Failed to update task');
            }
            console.error(error);
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted');
        },
        onError: (error) => {
            toast.error('Failed to delete task');
            console.error(error);
        },
    });
};
