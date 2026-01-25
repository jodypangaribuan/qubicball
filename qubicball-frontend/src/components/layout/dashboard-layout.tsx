"use client";

import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading, token } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !token) {
            router.push("/login");
        }
    }, [loading, token, router]);

    if (loading || !user) { // Wait for user to be populated
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
                <div className="animate-pulse text-sage font-serif text-xl">Loading ecosystem...</div>
            </div>
        )
    }

    const navItems = [
        { href: "/dashboard", label: "Projects", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: UserIcon }, // Placeholder
        // { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 z-20 bg-white border-r border-stone/50 hidden md:flex flex-col">
                <div className="p-8">
                    <div className="font-serif text-2xl font-bold text-deep-forest tracking-tight">
                        Qubicball<span className="text-sage">.</span>
                    </div>
                    <div className="text-xs text-deep-forest/40 uppercase tracking-widest mt-1 font-medium">{user.role} workspace</div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        // Special check for dashboard to not be active on subpages if needed, or strictly match. 
                        // Actually usually dashboard is active for /dashboard and /projects maybe?
                        // Let's keep it simple.

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-natural",
                                    isActive
                                        ? "bg-sage/10 text-deep-forest font-semibold"
                                        : "text-deep-forest/60 hover:bg-stone/20 hover:text-deep-forest"
                                )}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-stone/50">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate text-deep-forest">{user.name}</p>
                            <p className="text-xs text-deep-forest/50 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-terracotta hover:bg-terracotta/5 rounded-full transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
