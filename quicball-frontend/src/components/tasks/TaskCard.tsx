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

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const { user } = useAuthStore();

    const handleStatusChange = (value: string) => {
        updateTask.mutate({
            id: task.id,
            status: value as TaskStatus,
            version: task.version, // OPTIMISTIC LOCKING KEY
        });
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'Completed': return 'bg-green-500';
            case 'In Progress': return 'bg-blue-500';
            case 'Overdue': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const canDelete = user?.role === 'admin' || user?.role === 'manager';

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="text-xs text-gray-400">
                    Due: {task.due_date ? format(new Date(task.due_date), 'PPP') : 'No due date'}
                </div>
                {task.assignee && (
                    <div className="text-xs text-gray-500 mt-1">
                        Assigned to: {task.assignee.name}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Select onValueChange={handleStatusChange} defaultValue={task.status}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                {canDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => {
                            if (confirm('Delete task?')) deleteTask.mutate(task.id);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
