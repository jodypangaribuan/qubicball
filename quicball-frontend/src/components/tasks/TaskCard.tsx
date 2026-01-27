'use client';

import { Task, TaskStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';

import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const { user } = useAuthStore();

    const isPending = updateTask.isPending || deleteTask.isPending;

    const handleStatusChange = (value: string) => {
        updateTask.mutate({
            id: task.id,
            status: value as TaskStatus,
            version: task.version, // OPTIMISTIC LOCKING KEY
        });
    };

    const getStatusColor = (status: TaskStatus) => {
        // SaaS Style: Soft backgrounds, dark text
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none';
            case 'In Progress': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-none';
            case 'Overdue': return 'bg-red-100 text-red-700 hover:bg-red-200 border-none';
            default: return 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none';
        }
    };

    const canDelete = user?.role === 'admin' || user?.role === 'manager';
    const canEdit = user?.role === 'admin' || user?.role === 'manager';

    return (
        <Card className="h-full flex flex-col justify-between transition-shadow hover:shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-base font-medium text-foreground leading-snug">
                        {task.title}
                    </CardTitle>
                    <Badge variant="secondary" className={`shrink-0 rounded-md font-normal ${getStatusColor(task.status)}`}>
                        {task.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-4 px-5">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {task.description || 'No description provided.'}
                </p>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Due Date</span>
                        <span className="font-medium text-foreground">
                            {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
                        </span>
                    </div>
                    {task.assignee && (
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Assignee</span>
                            <span className="font-medium text-foreground">
                                {task.assignee.name}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex justify-between items-center mt-auto border-t pt-3">
                <Select onValueChange={handleStatusChange} defaultValue={task.status} disabled={isPending}>
                    <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                    {canEdit && <EditTaskDialog task={task} />}

                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => {
                                if (confirm('Delete task?')) deleteTask.mutate(task.id);
                            }}
                            disabled={isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
