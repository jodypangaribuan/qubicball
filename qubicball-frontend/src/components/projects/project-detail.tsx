
"use client";

import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = Number(params.id);
    const { data: project, isLoading: isProjectLoading } = useProject(projectId);
    const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);

    if (isProjectLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-start border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">{project.name}</h1>
                    <p className="font-serif text-lg text-muted-foreground mt-2">{project.description}</p>
                </div>
                <div>
                    <CreateTaskDialog projectId={projectId} />
                </div>
            </header>

            <section>
                <h2 className="text-xl font-mono uppercase tracking-widest mb-4">Tasks</h2>
                <TaskList tasks={tasks || []} projectId={projectId} />
            </section>
        </div>
    );
}
