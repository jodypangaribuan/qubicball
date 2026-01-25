"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("member");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative">
                <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700 ease-natural text-center p-10">
                    <div className="mb-4 text-4xl">🌱</div>
                    <CardTitle className="text-2xl mb-2">Registration Successful</CardTitle>
                    <CardDescription className="mb-6">
                        Welcome to the ecosystem, {name}. Please sign in to continue.
                    </CardDescription>
                    <Link href="/login">
                        <Button className="w-full">Go to Login</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute inset-x-0 bottom-0 h-64 bg-terracotta/5 rounded-t-[50%]" />

            <Card className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-natural">
                <CardHeader className="space-y-1 text-center">
                    <div className="font-serif text-3xl font-bold text-deep-forest mb-2">Qubicball<span className="text-sage">.</span></div>
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>
                        Join the workspace to start managing projects
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="flex h-12 w-full rounded-full border border-stone bg-white px-6 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-deep-forest/80"
                            >
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Register
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-deep-forest hover:underline font-medium">
                                Sign In
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
