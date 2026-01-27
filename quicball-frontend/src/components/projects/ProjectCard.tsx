'use client';

import { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useDeleteProject } from '@/hooks/useProjects';
import Link from 'next/link';
import { EditProjectDialog } from './EditProjectDialog';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const { user } = useAuthStore();
    const deleteProject = useDeleteProject();

    // Basic RBAC: Only Admin/Manager can delete
    const canEdit = user?.role === 'admin' || user?.role === 'manager';

    return (
        <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/20">
            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-muted-foreground font-medium">Project</span>
                    </div>
                    {canEdit && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <EditProjectDialog project={project} />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                    if (confirm('Are you sure?')) deleteProject.mutate(project.id)
                                }}
                                disabled={deleteProject.isPending}
                            >
                                <span className="sr-only">Delete</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                            </Button>
                        </div>
                    )}
                </div>

                <Link href={`/projects/${project.id}`} className="block group/title">
                    <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2 group-hover/title:text-primary transition-colors">
                        {project.name}
                    </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                    {project.description || 'No description provided.'}
                </p>

                <div className="flex justify-between items-center pt-4 border-t mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Created</span>
                        <span className="text-xs font-mono text-foreground">
                            {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
