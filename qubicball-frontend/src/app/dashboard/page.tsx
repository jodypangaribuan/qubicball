"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { Loader2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    created_at: string;
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Create Project State
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDesc, setNewProjectDesc] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    useEffect(() => {
        if (token) {
            fetchProjects();
        }
    }, [token]);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data || []);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newProjectName, description: newProjectDesc }),
            });

            if (res.ok) {
                setNewProjectName("");
                setNewProjectDesc("");
                setShowCreateForm(false);
                fetchProjects();
            }
        } catch (error) {
            console.error("Failed to create project", error);
        } finally {
            setCreateLoading(false);
        }
    };

    // Only Admin and Manager can create projects
    const canCreate = user?.role === "admin" || user?.role === "manager";

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-deep-forest mb-2">Projects</h1>
                    <p className="text-deep-forest/60">Overview of all active initiatives.</p>
                </div>

                {canCreate && (
                    <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
                        {showCreateForm ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> New Project</>}
                    </Button>
                )}
            </div>

            {showCreateForm && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500 ease-natural">
                    <Card className="max-w-xl mx-auto border-sage/30 bg-[#FAF9F7]">
                        <CardHeader>
                            <CardTitle>Create New Project</CardTitle>
                            <CardDescription>Define the scope and objectives.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleCreateProject}>
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Project Name"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    required
                                    className="bg-white"
                                />
                                <Input
                                    placeholder="Description"
                                    value={newProjectDesc}
                                    onChange={(e) => setNewProjectDesc(e.target.value)}
                                    className="bg-white"
                                />
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button type="submit" disabled={createLoading}>
                                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Project
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-sage" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-20 text-deep-forest/40 italic font-serif text-lg">
                            No projects found. Plant a seed.
                        </div>
                    )}
                    {projects.map((project, i) => (
                        <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                            <Card className="h-full hover:border-sage/30 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                                <CardHeader>
                                    <CardTitle className="group-hover:text-sage transition-colors">{project.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-0 text-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-sm font-medium flex items-center gap-2">
                                    View Details <ArrowRight size={14} />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
