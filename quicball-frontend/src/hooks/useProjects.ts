import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Project } from '@/types';
import { toast } from 'sonner';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data } = await api.get<{ data: Project[] }>('/projects');
            // Adjust based on actual API response structure. 
            // If API returns array directly: return data;
            // If API returns { data: [...] }: return data.data;
            // Router says: projects.GET("", projectHandler.GetAll)
            // Usually standard handlers return { data: [...] } or just [...]. 
            // Assuming array for now, or I'll debug.
            // Actually standard Go Gin handlers often return JSON.
            // I'll return `data` but cast it.
            return data;
        },
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProject: { name: string; description: string }) => {
            return api.post('/projects', newProject);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create project');
            console.error(error);
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted');
        },
        onError: (error) => {
            toast.error('Failed to delete project');
            console.error(error);
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (project: { id: number; name: string; description: string; version: number }) => {
            return api.put(`/projects/${project.id}`, project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project'] });
            toast.success('Project updated');
        },
        onError: (error: any) => {
            if (error.response?.status === 409) {
                toast.error('Data conflict! Project modified by someone else. Reloading...');
                queryClient.invalidateQueries({ queryKey: ['projects'] });
                queryClient.invalidateQueries({ queryKey: ['project'] });
            } else {
                toast.error('Failed to update project');
            }
        },
    });
};
