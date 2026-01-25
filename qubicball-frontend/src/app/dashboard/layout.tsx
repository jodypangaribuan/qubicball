"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
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

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area - Flex Column */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]"> {/* Light gray background for content area distinction */}
                <Header />

                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
