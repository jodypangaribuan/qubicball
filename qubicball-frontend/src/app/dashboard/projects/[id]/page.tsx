"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, Calendar, User, Circle, CheckCircle2, Clock, Trash2, Edit2 } from "lucide-react";
import { useProject } from "@/hooks/use-projects";
import { useTasks, useDeleteTask, useUpdateTask } from "@/hooks/use-tasks";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Task } from "@/types";

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = parseInt(params.id as string);
    const router = useRouter();

    const { data: project, isLoading: isProjectLoading } = useProject(projectId);
    const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);
    const { mutate: deleteTask } = useDeleteTask();
    const { mutate: updateTask } = useUpdateTask();

    if (isProjectLoading) {
        return <div className="p-12 font-mono uppercase tracking-widest animate-pulse">Loading Project Specification...</div>;
    }

    if (!project) {
        return <div className="p-12 font-mono uppercase tracking-widest text-red-600">Project Not Found</div>;
    }

    const handleDeleteTask = (taskId: number) => {
        if (confirm("DELETE TASK IRREVERSIBLY?")) {
            deleteTask({ id: taskId, projectId });
        }
    }

    const handleStatusChange = (task: Task, newStatus: "todo" | "in_progress" | "done") => {
        updateTask({
            id: task.id,
            data: { status: newStatus, project_id: projectId } as any // Type assertion for now if mismatch
        });
    }

    // Filter functionality could go here

    return (
        <div className="p-12 space-y-12 min-h-screen relative">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 mb-4">
                <ArrowLeft className="mr-2 h-3 w-3" /> Return to Index
            </Link>

            <header className="border-b-4 border-black pb-8 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-[0.9] uppercase break-words">
                            {project.name}
                        </h1>
                        <p className="font-serif text-xl md:text-2xl leading-relaxed border-l-2 border-black pl-6 italic text-muted-foreground">
                            {project.description}
                        </p>
                    </div>

                    <div className="text-right hidden md:block space-y-1">
                        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Project ID</p>
                        <p className="font-display text-4xl">{String(project.id).padStart(3, '0')}</p>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-8">
                    <div className="flex gap-8">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Created</p>
                            <p className="font-mono text-sm uppercase">{format(new Date(project.created_at), "dd MMM yyyy")}</p>
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="font-mono text-sm uppercase">Active</p>
                            </div>
                        </div>
                    </div>
                    <CreateTaskDialog projectId={projectId} />
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex justify-between items-center border-b border-black pb-4">
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Task Manifest</h2>
                    <p className="font-mono text-xs uppercase tracking-widest">{tasks?.length || 0} Records</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {isTasksLoading && <div className="font-mono text-xs uppercase animate-pulse">Loading Tasks...</div>}

                    {!isTasksLoading && tasks && tasks.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-black/20">
                            <p className="font-serif italic text-muted-foreground">No tasks recorded in this manifest.</p>
                        </div>
                    )}

                    {!isTasksLoading && tasks && tasks.map(task => (
                        <div key={task.id} className="group border border-black p-6 hover:bg-black hover:text-white transition-all duration-300 relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 max-w-3xl">
                                    <div className="flex items-center gap-3">
                                        <StatusIndicator status={task.status} />
                                        <h3 className="text-xl font-bold font-display uppercase tracking-wider">{task.title}</h3>
                                    </div>
                                    <p className="font-serif text-sm group-hover:text-gray-300 transition-colors line-clamp-2">
                                        {task.description}
                                    </p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 group-hover:text-white hover:bg-white/20">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-2 border-black rounded-none p-0">
                                        <DropdownMenuItem className="rounded-none focus:bg-black focus:text-white font-mono uppercase text-xs p-3 cursor-pointer" onClick={() => handleStatusChange(task, 'todo')}>
                                            Set Todo
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-none focus:bg-black focus:text-white font-mono uppercase text-xs p-3 cursor-pointer" onClick={() => handleStatusChange(task, 'in_progress')}>
                                            Set In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-none focus:bg-black focus:text-white font-mono uppercase text-xs p-3 cursor-pointer" onClick={() => handleStatusChange(task, 'done')}>
                                            Set Done
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-none focus:bg-red-600 focus:text-white font-mono uppercase text-xs p-3 cursor-pointer text-red-600" onClick={() => handleDeleteTask(task.id)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex gap-6 mt-6 pt-4 border-t border-black/10 group-hover:border-white/20">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-mono text-[10px] uppercase tracking-wider">
                                        Due: {format(new Date(task.due_date), "MMM d")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span className="font-mono text-[10px] uppercase tracking-wider">
                                        ID: {task.assignee_id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function StatusIndicator({ status }: { status: string }) {
    if (status === "done") {
        return <CheckCircle2 className="h-5 w-5 text-black group-hover:text-white" />;
    }
    if (status === "in_progress") {
        return <Clock className="h-5 w-5 text-black group-hover:text-white animate-pulse" />;
    }
    return <Circle className="h-5 w-5 text-black group-hover:text-white" />;
}
