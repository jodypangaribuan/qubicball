"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, FolderOpen, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import Link from "next/link";
import { format } from "date-fns"; // Standard JS works too but let's use JS Intl if date-fns not installed yet.

export default function DashboardPage() {
    const { data: projects, isLoading, isError } = useProjects();

    return (
        <div className="p-12 space-y-12">
            <header className="flex items-end justify-between border-b-4 border-black pb-8">
                <div className="space-y-2">
                    <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter">PROJECTS</h1>
                    <p className="font-serif text-xl italic text-muted-foreground">"The foundation of all achievement."</p>
                </div>
                <div className="hidden md:flex flex-col items-end gap-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-right">
                        Filter: All Projects<br />
                        Sort: Newest First
                    </div>
                    <CreateProjectDialog />
                </div>
            </header>

            <div className="md:hidden">
                <CreateProjectDialog />
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading && (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {isError && (
                    <div className="col-span-full py-20 text-center border border-red-500 bg-red-50 p-6">
                        <p className="text-red-600 font-mono uppercase">Failed to load projects</p>
                    </div>
                )}

                {!isLoading && projects && projects.length === 0 && (
                    <div className="col-span-full border border-dashed border-black/30 flex flex-col items-center justify-center p-12 min-h-[300px] text-center space-y-4">
                        <FolderOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="font-serif text-lg text-muted-foreground">No active projects.</p>
                    </div>
                )}

                {!isLoading && projects && projects.map((project) => (
                    <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                        <Card className="group hover:bg-black hover:text-white transition-colors cursor-pointer border-2 border-black h-full justify-between">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-2xl font-serif truncate w-[90%]">{project.name}</CardTitle>
                                    <ArrowUpRight className="h-6 w-6 group-hover:rotate-45 transition-transform shrink-0" />
                                </div>
                                <CardDescription className="group-hover:text-gray-300 font-mono text-xs uppercase pt-2 line-clamp-2">
                                    {project.description || "No description"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-12 flex items-end">
                                    {/* Mock count for now, update if API returns it */}
                                    <p className="text-4xl font-display">{project.tasks_count || 0}</p>
                                    <p className="font-mono text-xs uppercase mb-1 ml-2">Tasks</p>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-black/10 group-hover:border-white/20 pt-4 flex justify-between items-center">
                                <p className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                                    Created {format(new Date(project.created_at), "MMM d, yyyy")}
                                </p>
                                <div className="flex -space-x-2 opacity-50">
                                    {/* Placeholder avatars */}
                                    <div className="h-6 w-6 rounded-full border border-black bg-white"></div>
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </section>
        </div>
    );
}
