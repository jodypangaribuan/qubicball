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
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <a href="/dashboard" className="hover:text-gray-900 hover:underline">Projects</a>
                                <span>/</span>
                                <span>{project.name}</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{project.name}</h1>
                            <p className="text-gray-500 mt-2 max-w-2xl">{project.description}</p>
                        </div>
                        <CreateTaskDialog projectId={id} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kanban Columns */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                To Do
                            </h3>
                            <span className="bg-white px-2 py-0.5 rounded text-xs font-semibold text-gray-600 shadow-sm">{todoTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
                            {todoTasks.length === 0 && <div className="text-center py-8 text-gray-400 text-sm italic border border-dashed rounded-lg">No tasks</div>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                In Progress
                            </h3>
                            <span className="bg-white px-2 py-0.5 rounded text-xs font-semibold text-blue-600 shadow-sm">{inProgressTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                            {inProgressTasks.length === 0 && <div className="text-center py-8 text-gray-400 text-sm italic border border-dashed rounded-lg">No tasks</div>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                            <h3 className="font-semibold text-green-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Completed
                            </h3>
                            <span className="bg-white px-2 py-0.5 rounded text-xs font-semibold text-green-600 shadow-sm">{completedTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                            {completedTasks.length === 0 && <div className="text-center py-8 text-gray-400 text-sm italic border border-dashed rounded-lg">No tasks</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
