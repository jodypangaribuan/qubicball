"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, ListTodo, Users, LogOut, Plus } from "lucide-react";
import { useLogout, useUser } from "@/hooks/use-auth";

const navItems = [
    {
        title: "Projects",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "My Tasks",
        href: "/dashboard/tasks",
        icon: ListTodo,
    },
    {
        title: "Team",
        href: "/dashboard/team",
        icon: Users,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const logout = useLogout();
    const { data: user } = useUser();

    return (
        <div className="w-64 border-r border-black h-screen flex flex-col bg-background sticky top-0">
            <div className="p-8 border-b border-black">
                <h1 className="text-2xl font-display font-bold tracking-tighter leading-none">
                    QUBIC
                    <br />
                    BALL
                </h1>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-2">
                <div className="mb-8">
                    <Button className="w-full justify-start" size="lg">
                        <Plus className="mr-2 h-4 w-4" /> NEW PROJECT
                    </Button>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border border-transparent",
                                    isActive
                                        ? "bg-black text-white hover:bg-black/90"
                                        : "hover:bg-muted hover:border-black"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 border-t border-black space-y-4">
                <div className="px-4">
                    <p className="font-mono text-xs text-muted-foreground uppercase">Logged in as</p>
                    <p className="font-bold truncate">{user?.name || "User"}</p>
                </div>
                <Button
                    variant="secondary"
                    className="w-full justify-start text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    LOGOUT
                </Button>
            </div>
        </div>
    );
}
