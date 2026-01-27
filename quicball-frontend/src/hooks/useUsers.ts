import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from '@/types';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get<{ data: User[] }>('/auth/users');
            // Adjust based on backend response.
            // If backend returns array directly, return data.
            return data;
        },
    });
};
