import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const MOCK_TOKEN = "mock-token-qubicball-123"; // Deprecated, but keeping to avoid immediate breakage if referenced elsewhere, though not used here.

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await api.post<AuthResponse>("/api/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            Cookies.set("token", data.token, { expires: 1 }); // 1 day expiration to match typical JWT validity
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.push("/dashboard");
        },
    });
}

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await api.post<AuthResponse>("/api/auth/register", data);
            return response.data;
        },
        onSuccess: () => {
            router.push("/login"); // Redirect to login after registration
        },
    });
}

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) return null;

            try {
                const response = await api.get<User>("/api/auth/profile");
                return response.data;
            } catch (error) {
                return null;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return () => {
        Cookies.remove("token");
        queryClient.setQueryData(["user"], null);
        router.push("/login");
    };
}

export function useAllUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get<User[]>("/api/auth/users");
            return response.data;
        },
    });
}
