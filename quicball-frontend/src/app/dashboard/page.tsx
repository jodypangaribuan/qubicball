'use client';

import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ... existing imports

export default function DashboardPage() {
    const { data: projects, isLoading, error } = useProjects();
    const { user, token, logout } = useAuthStore();
    const router = useRouter();

    // ... existing hook calls (omitted for brevity in prompt but implicitly kept by structure, usually)
    // Actually, I need to keep the hook logic. The ReplaceFileContent instruction replaces the whole function usually unless I'm careful with ranges.
    // I will rewrite the whole component to be safe as I am replacing from line 14.

    useEffect(() => {
        if (!token) router.push('/login');
    }, [token, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-muted-foreground"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-destructive">Error loading projects.</div>;
    }

    const projectList = Array.isArray(projects) ? projects : (projects as any)?.data || [];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="mr-4 flex">
                        <a className="mr-6 flex items-center space-x-2 font-bold text-lg tracking-tight" href="#">
                            <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                            </div>
                            <span>QubicBall</span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground hidden md:inline-block">{user?.email}</span>
                            <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/login'); }}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-8 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                        <p className="text-muted-foreground">Manage your team projects and tasks.</p>
                    </div>
                    <div>
                        {user?.role === 'admin' || user?.role === 'manager' ? (
                            <CreateProjectDialog />
                        ) : (
                            <Badge variant="secondary">View Only</Badge>
                        )}
                    </div>
                </div>

                {projectList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold">No projects created</h3>
                        <p className="mb-4 text-sm text-muted-foreground max-w-sm">
                            You haven't created any projects yet. Start by creating one to track tasks.
                        </p>
                        {user?.role === 'admin' || user?.role === 'manager' && (
                            <CreateProjectDialog />
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projectList.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
