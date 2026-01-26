'use client';

import { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useDeleteProject } from '@/hooks/useProjects';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const { user } = useAuthStore();
    const deleteProject = useDeleteProject();

    // Basic RBAC: Only Admin/Manager can delete
    const canDelete = user?.role === 'admin' || user?.role === 'manager';

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {project.description || 'No description provided.'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                        View Tasks
                    </Button>
                </Link>
                {canDelete && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm('Are you sure?')) deleteProject.mutate(project.id)
                        }}
                        disabled={deleteProject.isPending}
                    >
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
