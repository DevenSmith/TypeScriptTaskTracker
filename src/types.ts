export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}

export type NewTask = Omit<Task, "id" | "completed">;

export type TaskUpdates = Partial<Pick<Task, "title" | "priority">>;