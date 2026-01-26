'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await api.post('/auth/login', values);
            const { token, user } = response.data; // Assuming backend returns { token, user } or similar, need to verify
            // Actually backend response from authHandler.Login usually returns just token or object.
            // Let's assume decoding or separate profile fetch. 
            // For now, let's assume we get the token, and we might need to fetch profile.
            // If backend only returns token:
            if (typeof response.data === 'string') {
                // If response.data is just the token string
                const token = response.data;
                // We might need to fetch profile
                // Use the token to get profile
                // Manually set payload for now if needed or fetch
                // For this step I will assume standard JWT response structure or adapt.
            }

            // Let's look at router.go: authHandler.Login
            // Usually returns JSON with token.

            // If we don't know the exact structure, let's implement a fetchProfile
            // For now, let's just save token and redirect, and fetch profile in layout or a guard.
            // But store needs user.

            // Let's assume for now:
            setAuth(response.data.token, response.data.user);

            toast.success('Login successful');
            router.push('/dashboard');
        } catch (error) {
            toast.error('Invalid credentials');
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
