"use client";

import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import { TaskList } from "@/components/tasks/task-list";
import { useUser } from "@/hooks/use-auth";
import { useDeleteProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProjectDetailAndTasksPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = parseInt(params.id as string);
    const { data: project, isLoading: isProjectLoading } = useProject(projectId);
    const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);
    const { data: user } = useUser();
    const { mutate: deleteProject } = useDeleteProject();

    if (isProjectLoading) {
        return <div className="p-12 font-mono uppercase tracking-widest animate-pulse">Loading Project Specification...</div>;
    }

    if (!project) {
        return <div className="p-12 font-mono uppercase tracking-widest text-red-600">Project Not Found</div>;
    }

    const handleDeleteProject = () => {
        if (confirm("DELETE PROJECT? THIS ACTION CANNOT BE UNDONE.")) {
            deleteProject(projectId, {
                onSuccess: () => router.push("/dashboard")
            });
        }
    };

    const canDeleteProject = user?.role === "admin";

    return (
        <div className="p-12 space-y-12 min-h-screen relative">
            <div className="flex justify-between items-center mb-4">
                <Link href="/dashboard" className="inline-flex items-center text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4">
                    <ArrowLeft className="mr-2 h-3 w-3" /> Return to Index
                </Link>
                {canDeleteProject && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteProject} className="uppercase font-mono text-xs">
                        <Trash2 className="mr-2 h-3 w-3" /> Delete Project
                    </Button>
                )}
            </div>

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

                {isTasksLoading ? (
                    <div className="font-mono text-xs uppercase animate-pulse">Loading Tasks...</div>
                ) : (
                    <TaskList tasks={tasks || []} projectId={projectId} />
                )}
            </section>
        </div>
    );
}
