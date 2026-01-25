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
import { useCreateTask } from "@/hooks/use-tasks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-auth";

const formSchema = z.object({
    title: z.string().min(1, "TITLE REQUIRED"),
    description: z.string().optional(),
    due_date: z.string().min(1, "DUE DATE REQUIRED"),
    assignee_id: z.string().regex(/^\d+$/, "ID MUST BE NUMBER"), // Temporary ID input
});

interface CreateTaskDialogProps {
    projectId: number;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: createTask, isPending } = useCreateTask();
    const { data: user } = useUser();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assignee_id: user?.id ? String(user.id) : "1",
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Format date to ISO if needed, or backend handles YYYY-MM-DD? 
        // Postman payload: "2026-12-31T23:59:59Z".
        // Input type=date returns YYYY-MM-DD.
        // I need to convert.
        const isoDate = new Date(data.due_date).toISOString();

        createTask(
            {
                title: data.title,
                description: data.description || "",
                due_date: isoDate,
                project_id: projectId,
                assignee_id: parseInt(data.assignee_id)
            },
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
                <Button className="uppercase tracking-widest text-xs h-10 px-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-2 border-black p-0 overflow-hidden gap-0">
                <DialogHeader className="bg-black text-white p-6 rounded-none">
                    <DialogTitle className="font-display text-2xl uppercase tracking-wider">New Task</DialogTitle>
                    <DialogDescription className="text-gray-400 font-mono text-xs uppercase tracking-widest">
                        Define assignment parameters
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="uppercase font-mono text-xs tracking-widest">Task Title</Label>
                        <Input
                            id="title"
                            {...register("title")}
                            className="font-serif text-lg"
                            placeholder="e.g. Design Review"
                        />
                        {errors.title && <p className="text-red-600 text-xs font-mono uppercase">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="uppercase font-mono text-xs tracking-widest">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            className="font-serif resize-none border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-b-4"
                            placeholder="Requirements and scope..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="due_date" className="uppercase font-mono text-xs tracking-widest">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                {...register("due_date")}
                                className="font-mono text-sm uppercase"
                            />
                            {errors.due_date && <p className="text-red-600 text-xs font-mono uppercase">{errors.due_date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignee_id" className="uppercase font-mono text-xs tracking-widest">Assignee ID</Label>
                            <Input
                                id="assignee_id"
                                {...register("assignee_id")}
                                className="font-mono text-sm"
                                placeholder="User ID"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "CREATING..." : "CONFIRM ASSIGNMENT"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
