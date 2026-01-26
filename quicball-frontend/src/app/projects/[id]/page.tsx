'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Project, Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { Loader2 } from 'lucide-react';

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    // Fetch Project Details
    const { data: projectData, isLoading: isProjectLoading } = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data } = await api.get<{ data: Project }>(`/projects/${id}`);
            // Backend returns single object or { data: object }
            // projectHandler.GetByID -> usually returns JSON
            return data;
        },
        enabled: !!id,
    });

    const { data: tasksData, isLoading: isTasksLoading } = useTasks(id);

    if (isProjectLoading || isTasksLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Handle data wrappers
    const project = (projectData as any)?.data || projectData as any; // Cast safely
    const tasks = (Array.isArray(tasksData) ? tasksData : (tasksData as any)?.data || []) as Task[];

    if (!project) return <div>Project not found</div>;

    const todoTasks = tasks.filter(t => t.status === 'Not Started');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-gray-500 mt-2">{project.description}</p>
                </div>
                <CreateTaskDialog projectId={id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kanban Columns */}
                <div className="bg-gray-50/50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4 text-gray-700">To Do ({todoTasks.length})</h3>
                    {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
                <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold mb-4 text-blue-700">In Progress ({inProgressTasks.length})</h3>
                    {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
                <div className="bg-green-50/30 p-4 rounded-lg border border-green-100">
                    <h3 className="font-semibold mb-4 text-green-700">Completed ({completedTasks.length})</h3>
                    {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            </div>
        </div>
    );
}
