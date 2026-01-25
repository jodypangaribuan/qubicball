import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types";

export function useTasks(projectId: number) {
    return useQuery({
        queryKey: ["tasks", projectId],
        queryFn: async () => {
            const response = await api.get<{ data: Task[] } | Task[]>(`/api/tasks/project/${projectId}`);
            // Normalized return
            if ('data' in response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return [];
        },
        enabled: !!projectId,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTaskRequest) => {
            const response = await api.post<Task>("/api/tasks", data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["tasks", variables.project_id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // Update counts
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateTaskRequest }) => {
            const response = await api.put<Task>(`/api/tasks/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // We need project_id to invalidate list properly if we don't have it in data response
            // Ideally response returns the task.
            queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
            await api.delete(`/api/tasks/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
        },
    });
}
