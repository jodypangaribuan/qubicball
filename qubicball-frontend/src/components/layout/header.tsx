"use client";

import { useLogout, useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Header() {
    const { data: user } = useUser();
    const logout = useLogout();

    return (
        <header className="h-20 border-b border-black/10 bg-background flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-sm bg-background/80">
            {/* Left: Search or Breadcrumbs */}
            <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="SEARCH..."
                        className="pl-10 font-mono text-xs uppercase tracking-widest border-none bg-muted/30 focus-visible:ring-0 focus-visible:bg-muted/50 rounded-full h-10"
                    />
                </div>
            </div>

            {/* Right: User User Controls */}
            <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="h-6 w-px bg-border/50" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold leading-none">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground font-mono uppercase mt-1">{user?.email}</p>
                    </div>

                    <Avatar className="h-10 w-10 border border-black/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                        <AvatarFallback>
                            {user?.name?.slice(0, 2).toUpperCase() || "US"}
                        </AvatarFallback>
                    </Avatar>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => logout()}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
