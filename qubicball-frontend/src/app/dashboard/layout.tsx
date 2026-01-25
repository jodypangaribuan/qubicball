"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading, isError } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            // Double check token existence or error
            // Ideally useUser returns null if no token.
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono uppercase tracking-widest text-sm animate-pulse">
                Loading Workspace...
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen flex bg-background max-w-7xl mx-auto border-r border-l border-black shadow-[20px_0_40px_rgba(0,0,0,0.05)]">
            {/* Container constrained to max-w-7xl for "Editorial" feel, centered */}
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
