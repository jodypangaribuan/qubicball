
"use client";

import { useAllUsers } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamPage() {
    const { data: users, isLoading } = useAllUsers();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-12 space-y-8">
            <header className="border-b-4 border-black pb-8">
                <h1 className="text-5xl font-display font-bold tracking-tighter uppercase">Team</h1>
                <p className="font-serif text-xl text-muted-foreground mt-2">Collaborators and contributors.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users && users.map((user) => (
                    <Card key={user.id} className="border-2 border-black rounded-none shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-full font-mono font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold font-sans">{user.name}</CardTitle>
                                <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2">
                                <Badge variant="secondary" className="uppercase font-mono text-[10px] tracking-widest rounded-none">
                                    {user.role}
                                </Badge>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                    ID: {user.id}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
