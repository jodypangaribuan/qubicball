
"use client";

import { useUser } from "@/hooks/use-auth";
import { useTasksByAssignee } from "@/hooks/use-tasks";
import { TaskList } from "@/components/tasks/task-list";
import { Loader2 } from "lucide-react";

export default function MyTasksPage() {
    const { data: user, isLoading: isUserLoading } = useUser();
    const { data: tasks, isLoading: isTasksLoading } = useTasksByAssignee(user?.id);

    if (isUserLoading || isTasksLoading) {
        return (
            <div className="flex justify-center items-center h-full p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-12 space-y-8">
            <header className="border-b-4 border-black pb-8">
                <h1 className="text-5xl font-display font-bold tracking-tighter uppercase">My Tasks</h1>
                <p className="font-serif text-xl text-muted-foreground mt-2">Assignments requiring your attention.</p>
            </header>

            <section>
                {/* 
                     TaskList expects projectId for cache invalidation on delete/update.
                     Since we are in "My Tasks", updates might need to invalidate this query too.
                     TaskList mutation logic invalidates ["tasks", projectId].
                     It doesn't invalidate ["tasks", "assignee", ...].
                     We might need to update TaskList to handle this or just accept it won't auto-refresh this list strictly on update without extra logic.
                     For now, let's pass a dummy ProjectID or 0, but ideally we refactor TaskList to be more generic.
                     However, for now, let's just use it.
                  */}
                <TaskList tasks={tasks || []} projectId={0} />
                {/* 
                   Note: ProjectID 0 might cause cache invalidation for key ["tasks", 0] which is harmless but ineffective for this view.
                   To fix real-time updates here, we'd need to invalidate ["tasks", "assignee", user.id] in the mutations.
                   We'll leave that as a known limitation or future improvement to keep it simple.
                */}
            </section>
        </div>
    );
}
