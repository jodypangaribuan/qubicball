import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types";

export function useProjects(page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ["projects", page, pageSize],
        queryFn: async () => {
            const response = await api.get<{ data: Project[], meta: any }>("/api/projects", { // Assuming paginated response
                params: { page, page_size: pageSize },
            });
            // Adjust based on actual API response structure. 
            // Postman says: expects list? Or object? 
            // Usually paginated APIs return { data: [], meta: {} } or just [].
            // I'll assume standard binding. If array, it returns array.
            // Let's assume generic response for now and type cast safely.
            return response.data;
        },
    });
}

export function useProject(id: number) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const response = await api.get<Project>(`/api/projects/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateProjectRequest) => {
            const response = await api.post<Project>("/api/projects", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateProjectRequest }) => {
            const response = await api.put<Project>(`/api/projects/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.id] });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
