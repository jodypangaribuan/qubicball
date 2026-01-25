"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/use-projects";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "NAME REQUIRED"),
    description: z.string().optional(),
});

interface CreateProjectDialogProps {
    trigger?: React.ReactNode;
}

export function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: createProject, isPending } = useCreateProject();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        createProject(
            { name: data.name, description: data.description || "" },
            {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button className="uppercase tracking-widest text-xs">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-2 border-black p-0 overflow-hidden gap-0">
                <DialogHeader className="bg-black text-white p-6 rounded-none">
                    <DialogTitle className="font-display text-2xl uppercase tracking-wider">Create Project</DialogTitle>
                    <DialogDescription className="text-gray-400 font-mono text-xs uppercase tracking-widest">
                        Initialize a new workspace
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase font-mono text-xs tracking-widest">Project Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            className="font-serif text-lg"
                            placeholder="e.g. Qubicball 2.0"
                        />
                        {errors.name && <p className="text-red-600 text-xs font-mono uppercase">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="uppercase font-mono text-xs tracking-widest">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            className="font-serif resize-none border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-b-4"
                            placeholder="Brief summary..."
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "INITIALIZING..." : "CREATE PROJECT"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
