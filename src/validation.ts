import type { Priority, Task } from "./types.js";

export function isPriority(value: string): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

export function parseTaskId(input: string): number | undefined {
  const id = Number(input);

  if (!Number.isInteger(id) || id <= 0) {
    return undefined;
  }

  return id;
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "completed" in value &&
    typeof value.completed === "boolean" &&
    "priority" in value &&
    typeof value.priority === "string" &&
    isPriority(value.priority)
  );
}