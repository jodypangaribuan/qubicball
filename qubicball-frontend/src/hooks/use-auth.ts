import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await api.post<AuthResponse>("/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            Cookies.set("token", data.token, { expires: 7 }); // 7 days
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.push("/dashboard");
        },
    });
}

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await api.post<AuthResponse>("/auth/register", data); // Assuming register returns token? 
            // Postman says Register returns [] (empty)? 
            // If it doesn't return token, we need to login after or redirect to login.
            // Let's assume generic void response if not specified, 
            // but usually modern apps auto-login.
            // Based on Postman: "response": [] implies empty or not captured.
            // I'll assume we redirect to login to be safe unless verified otherwise.
            return response.data;
        },
        onSuccess: () => {
            // If backend doesn't auto-login, redirect to login
            router.push("/login");
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
                const response = await api.get<User>("/auth/profile");
                return response.data;
            } catch (error) {
                return null; // Return null on error (401 handled by interceptor ideally, but here we just want 'no user')
            }
        },
        retry: false,
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
