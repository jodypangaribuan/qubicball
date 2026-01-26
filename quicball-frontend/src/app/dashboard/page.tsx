'use client';

import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { data: projects, isLoading, error } = useProjects();
    const { user, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            // Simple client-side protect
            router.push('/login');
        }
    }, [token, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading projects.</div>;
    }

    // Ensure projects is an array (handle API wrapper)
    // If backend returns { data: [...] } and hook returns it, we need to check.
    // Assuming hook returns what we need or we cast it.
    const projectList = Array.isArray(projects) ? projects : (projects as any)?.data || [];

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <CreateProjectDialog />
                )}
            </div>

            {projectList.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No projects found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectList.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
