import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types";

export function useTasks(projectId: number) {
    return useQuery({
        queryKey: ["tasks", projectId],
        queryFn: async () => {
            // Assuming endpoint is /tasks/project/:id
            // Not /api/tasks... api instance handles baseURL
            const response = await api.get<Task[]>(`/api/tasks/project/${projectId}`);
            return response.data;
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
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // Update counts if applicable
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

export function useTasksByAssignee(assigneeId: number | undefined) {
    return useQuery({
        queryKey: ["tasks", "assignee", assigneeId],
        queryFn: async () => {
            if (!assigneeId) return [];
            const response = await api.get<Task[]>(`/api/tasks/assignee/${assigneeId}`);
            return response.data;
        },
        enabled: !!assigneeId,
    });
}
