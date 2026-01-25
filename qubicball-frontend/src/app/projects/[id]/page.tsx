"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, Circle, Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation"; // useParams returns Params object, check Next version
import Link from "next/link";
import { useEffect, useState, use } from "react";

// This page uses client-side data fetching with hooks

interface Project {
    id: number;
    name: string;
    description: string;
    owner_id: number;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: "Not Started" | "In Progress" | "Completed";
    project_id: number;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // We use useParams() to get the project ID from the URL

    const { id } = useParams();
    const projectId = id as string;

    const { user, token } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Create Task State
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [createLoading, setCreateLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const fetchProjectAndTasks = async () => {
        if (!projectId || !token) return;

        try {
            setLoading(true);
            // Fetch Project
            const projRes = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (projRes.ok) {
                setProject(await projRes.json());
            } else {
                // Handle 404 or unauthorized
                router.push("/dashboard");
                return;
            }

            // Fetch Tasks
            const taskRes = await fetch(`${API_URL}/tasks/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (taskRes.ok) {
                setTasks(await taskRes.json() || []);
            }

        } catch (error) {
            console.error("Error details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectAndTasks();
    }, [projectId, token]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setCreateLoading(true);
        try {
            const res = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newTaskTitle,
                    project_id: parseInt(projectId),
                    status: "Not Started"
                }),
            });

            if (res.ok) {
                setNewTaskTitle("");
                fetchProjectAndTasks(); // Refresh list
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleUpdateStatus = async (task: Task, newStatus: string) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...task, status: newStatus }),
            });
            if (res.ok) {
                // Optimistic update or refresh
                setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== taskId));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteProject = async () => {
        if (!project) return;
        if (!confirm("Delete this project? This cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/projects/${project.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-sage" />
                </div>
            </DashboardLayout>
        )
    }

    if (!project) return null;

    const canEditProject = user?.role === "admin" || user?.role === "manager";
    // Assuming all members can create tasks for now, or restriction applies.
    // Requirements: "Permission-based access to projects & tasks". 
    // Let's say all members can manage tasks in projects they can see.

    return (
        <DashboardLayout>
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-natural">
                <div className="flex justify-between items-start">
                    <div>
                        <Link href="/dashboard" className="text-sm text-sage mb-2 block hover:underline">← Back to Projects</Link>
                        <h1 className="text-4xl font-serif font-bold text-deep-forest mb-2">{project.name}</h1>
                        <p className="text-deep-forest/60 max-w-2xl">{project.description}</p>
                    </div>

                    {canEditProject && (
                        <Button variant="ghost" onClick={handleDeleteProject} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={18} className="mr-2" /> Delete Project
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Task Stats / Create Task */}
                <div className="md:col-span-1 space-y-8">
                    <Card className="bg-[#FAF9F7] border-none shadow-inner">
                        <CardHeader>
                            <CardTitle>Add Task</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <Input
                                    placeholder="What needs to be done?"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="bg-white"
                                />
                                <Button type="submit" className="w-full" disabled={createLoading}>
                                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Task
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {(["Not Started", "In Progress", "Completed"] as const).map(status => {
                        const count = tasks.filter(t => t.status === status).length;
                        return (
                            <div key={status} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone/30">
                                <div className="flex items-center gap-3">
                                    {status === "Completed" ? <CheckCircle className="text-sage" size={20} /> :
                                        status === "In Progress" ? <Clock className="text-terracotta" size={20} /> :
                                            <Circle className="text-stone" size={20} />}
                                    <span className="font-medium text-deep-forest">{status}</span>
                                </div>
                                <span className="text-xl font-serif font-bold text-deep-forest/50">{count}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Task List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-serif font-semibold mb-6">Task Board</h3>
                    {tasks.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-stone/30 rounded-3xl">
                            <p className="text-deep-forest/40 italic">Quietness before the bloom. Add a task.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <Card key={task.id} className="group hover:border-sage/50 transition-colors">
                                <CardContent className="p-6 flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className={cn(
                                                "font-medium text-lg transition-all",
                                                task.status === "Completed" && "text-deep-forest/40 line-through decoration-sage"
                                            )}>
                                                {task.title}
                                            </p>
                                            <span className={cn(
                                                "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold",
                                                task.status === "Completed" ? "bg-sage/20 text-sage" :
                                                    task.status === "In Progress" ? "bg-terracotta/10 text-terracotta" :
                                                        "bg-stone/20 text-deep-forest/60"
                                            )}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-deep-forest/50">{task.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {task.status !== "Completed" && (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-sage hover:bg-sage/10"
                                                onClick={() => handleUpdateStatus(task, "Completed")}
                                                title="Mark Complete"
                                            >
                                                <CheckCircle size={16} />
                                            </Button>
                                        )}
                                        {task.status !== "In Progress" && task.status !== "Completed" && (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-terracotta hover:bg-terracotta/10"
                                                onClick={() => handleUpdateStatus(task, "In Progress")}
                                                title="Start Progress"
                                            >
                                                <Clock size={16} />
                                            </Button>
                                        )}
                                        {(user?.role === "admin" || user?.role === "manager") && (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-300 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
