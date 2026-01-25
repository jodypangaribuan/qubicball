export type Role = "admin" | "manager" | "member";

export interface User {
    id: number;
    email: string;
    name: string;
    role: Role;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: Role;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    tasks_count?: number; // Optional derived field
}

export interface CreateProjectRequest {
    name: string;
    description: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
}

export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "Overdue";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    due_date: string;
    project_id: number;
    assignee_id: number;
    created_at: string;
    updated_at: string;
    assignee?: User; // Optional expanded field
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    due_date: string;
    project_id: number;
    assignee_id: number;
    status?: TaskStatus;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    due_date?: string;
    assignee_id?: number;
    project_id?: number;
}
