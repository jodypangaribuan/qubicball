export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'member';
}

export interface Project {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    owner?: User;
    version: number;
    created_at: string;
    updated_at: string;
}

export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    due_date: string;
    project_id: number;
    assignee_id?: number;
    assignee?: User;
    version: number;
    created_at: string;
    updated_at: string;
}
