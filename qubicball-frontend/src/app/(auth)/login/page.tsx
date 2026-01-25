"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    email: z.string().email({
        message: "INVALID EMAIL ADDRESS.",
    }),
    password: z.string().min(1, {
        message: "PASSWORD REQUIRED.",
    }),
});

export default function LoginPage() {
    const { mutate: login, isPending, error } = useLogin();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setServerError(null);
        login(values, {
            onError: (err: any) => {
                setServerError(err.response?.data?.error || "AUTHENTICATION FAILED");
            },
        });
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Editorial/Brand */}
            <div className="bg-foreground text-background p-12 md:p-24 flex flex-col justify-between border-b md:border-b-0 md:border-r border-background/20 relative overflow-hidden">
                <div className="z-10">
                    <h1 className="text-8xl md:text-9xl font-display font-bold tracking-tighter leading-[0.8]">
                        QUBIC
                        <br />
                        BALL
                    </h1>
                    <div className="mt-8 border-t border-background pt-4 inline-block">
                        <p className="font-mono text-sm tracking-widest uppercase">
                            Project Management System
                            <br />
                            V. 1.0.0
                        </p>
                    </div>
                </div>

                <div className="z-10 mt-12 md:mt-0">
                    <p className="font-serif text-2xl md:text-3xl italic leading-tight max-w-md">
                        "Order is the principle of existence."
                    </p>
                </div>

                {/* Decorative Grid Background for texture */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="p-12 md:p-24 flex items-center justify-center bg-background">
                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-display font-bold uppercase tracking-tight">
                            Authentication
                        </h2>
                        <p className="font-serif text-lg text-muted-foreground border-l-2 border-black pl-4">
                            Enter your credentials to access the workspace.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-mono text-xs tracking-widest">Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="USER@EXAMPLE.COM" {...field} className="font-mono" />
                                        </FormControl>
                                        <FormMessage className="font-mono uppercase text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-mono text-xs tracking-widest">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="font-mono" />
                                        </FormControl>
                                        <FormMessage className="font-mono uppercase text-xs" />
                                    </FormItem>
                                )}
                            />

                            {serverError && (
                                <div className="p-3 border border-red-500/50 bg-red-50 text-red-600 font-mono text-xs uppercase tracking-wide">
                                    ERROR: {serverError}
                                </div>
                            )}

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? "AUTHENTICATING..." : "ENTER WORKSPACE"}
                                </Button>
                            </div>

                            <div className="text-center pt-4 border-t border-muted">
                                <p className="font-serif text-muted-foreground text-sm">
                                    Don't have an account?{" "}
                                    <Link href="/register" className="text-foreground underline decoration-1 underline-offset-4 hover:bg-black hover:text-white transition-colors px-1">
                                        Request Access
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
