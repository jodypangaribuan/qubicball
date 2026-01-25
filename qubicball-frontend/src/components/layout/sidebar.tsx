"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, ListTodo, Users, Plus, Hash } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useUser } from "@/hooks/use-auth";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"; // Assume this can be used here or trigger it, but Sidebar has a button "NEW PROJECT".
// Since CreateProjectDialog is a dialog component, we might need it here or trigger global state. 
// For now, let's just make the NEW PROJECT button trigger the dialog if we can, or just keep it as is (maybe it's a link? No it's a button).
// Actually, looking at dashboard/page.tsx, CreateProjectDialog renders the button internally? 
// Let's check CreateProjectDialog.
// For now, let's just render the list.

const navItems = [
    {
        title: "Overview",
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
    const { data: projects } = useProjects();
    const { data: user } = useUser();

    return (
        <div className="w-72 border-r border-black/10 h-screen flex flex-col bg-background sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
            <div className="p-8 border-b border-black/10 flex items-center justify-center">
                <Link href="/dashboard">
                    <h1 className="text-3xl font-display font-bold tracking-tighter leading-[0.8]">
                        QUBIC
                        <br />
                        BALL
                    </h1>
                </Link>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
                {user?.role !== "member" && (
                    <div className="w-full">
                        <CreateProjectDialog trigger={
                            <Button className="w-full justify-start shadow-lg hover:shadow-xl transition-all" size="lg">
                                <Plus className="mr-2 h-4 w-4" /> NEW PROJECT
                            </Button>
                        } />
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <p className="px-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Menu</p>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg",
                                            isActive
                                                ? "bg-black text-white shadow-md translate-x-1"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {projects && projects.length > 0 && (
                        <div>
                            <p className="px-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Projects</p>
                            <nav className="space-y-1">
                                {projects.map((project) => {
                                    const href = `/dashboard/projects/${project.id}`;
                                    const isActive = pathname === href;
                                    return (
                                        <Link
                                            key={project.id}
                                            href={href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all rounded-lg",
                                                isActive
                                                    ? "bg-muted font-bold translate-x-1"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Hash className="h-3 w-3" />
                                            {project.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-black/10">
                <div className="bg-muted/30 p-4 rounded-xl">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Current Workspace</p>
                    <p className="font-bold text-sm">Qubic Team</p>
                </div>
            </div>
        </div>
    );
}
