
"use client";

import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDeleteTask, useUpdateTask } from "@/hooks/use-tasks";
import { useUser } from "@/hooks/use-auth";

interface TaskListProps {
    tasks: Task[];
    projectId: number;
}

export function TaskList({ tasks, projectId }: TaskListProps) {
    const { mutate: deleteTask } = useDeleteTask();
    const { mutate: updateTask } = useUpdateTask();
    const { data: user } = useUser();

    const handleDeleteTask = (taskId: number) => {
        if (confirm("DELETE TASK?")) {
            deleteTask({ id: taskId, projectId });
        }
    }

    const handleStatusChange = (task: Task, newStatus: "Not Started" | "In Progress" | "Completed") => {
        updateTask({
            id: task.id,
            data: { status: newStatus, project_id: projectId }
        });
    }

    const canDelete = user?.role === "admin" || user?.role === "manager";

    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-gray-300">
                <p className="text-muted-foreground font-serif italic">No tasks yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <Card key={task.id} className="border-2 border-black rounded-none shadow-sm hover:shadow-md transition-shadow group">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <StatusIcon status={task.status} />
                            <CardTitle className="text-lg font-bold font-sans">{task.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-widest">
                                {task.status}
                            </Badge>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black hover:text-white">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-2 border-black rounded-none p-0">
                                    <DropdownMenuItem className="rounded-none font-mono uppercase text-xs p-3 cursor-pointer hover:bg-black hover:text-white focus:bg-black focus:text-white" onClick={() => handleStatusChange(task, 'Not Started')}>
                                        Set Not Started
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-none font-mono uppercase text-xs p-3 cursor-pointer hover:bg-black hover:text-white focus:bg-black focus:text-white" onClick={() => handleStatusChange(task, 'In Progress')}>
                                        Set In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-none font-mono uppercase text-xs p-3 cursor-pointer hover:bg-black hover:text-white focus:bg-black focus:text-white" onClick={() => handleStatusChange(task, 'Completed')}>
                                        Set Completed
                                    </DropdownMenuItem>
                                    {canDelete && (
                                        <DropdownMenuItem className="rounded-none font-mono uppercase text-xs p-3 cursor-pointer text-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white" onClick={() => handleDeleteTask(task.id)}>
                                            <Trash2 className="mr-2 h-3 w-3" /> Delete
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4 font-serif">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono uppercase">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No Due Date"}
                            </div>
                            {task.assignee && (
                                <div>Assignee: {task.assignee.name}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "Completed":
            return <CheckCircle2 className="h-5 w-5 text-green-600" />;
        case "In Progress":
            return <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />; // Or just a blue circle
        case "Overdue":
            return <Clock className="h-5 w-5 text-red-600" />;
        default:
            return <Circle className="h-5 w-5 text-gray-400" />;
    }
}
