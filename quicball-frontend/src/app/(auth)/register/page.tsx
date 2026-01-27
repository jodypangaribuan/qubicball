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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await api.post('/auth/register', values);
            toast.success('Registration successful! Please login.');
            router.push('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-background p-6">
            <Card className="w-full max-w-md border-thin shadow-sm rounded-none md:rounded-lg overflow-hidden">
                <CardHeader className="text-center space-y-4 pt-12 pb-8">
                    <div className="mx-auto bg-primary text-primary-foreground p-3 w-fit mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                    </div>
                    <CardTitle className="text-4xl font-serif text-foreground">Join the Team</CardTitle>
                    <p className="font-sans text-muted-foreground tracking-wide">Create your account to get started.</p>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="small-caps text-muted-foreground">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                                className="h-12 bg-transparent border-input rounded-md focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="small-caps text-muted-foreground">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                {...field}
                                                className="h-12 bg-transparent border-input rounded-md focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent transition-colors"
                                            />
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
                                        <FormLabel className="small-caps text-muted-foreground">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="h-12 bg-transparent border-input rounded-md focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-12 text-base font-medium tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md shadow-sm">
                                Create Account
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
