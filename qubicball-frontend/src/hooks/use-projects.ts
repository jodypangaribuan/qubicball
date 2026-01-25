import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types";

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            // Backend supports pagination but let's fetch default first page or all if backend allows.
            // Backend GetAll implementation uses limit/offset.
            // Let's pass a large limit for now to simulate "Get All" behavior as sidebar needs all projects usually.
            const response = await api.get<Project[]>("/api/projects", {
                params: { page: 1, page_size: 100 },
            });
            return response.data;
        },
    });
}

export function useProject(id: number) {
    return useQuery({
        queryKey: ["projects", id],
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
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
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
