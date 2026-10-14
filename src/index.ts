import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile, writeFile } from "node:fs/promises";

import type {
  NewTask,
  Priority,
  Task,
  TaskUpdates,
} from "./types.js";


function addTask(input: NewTask): Task {
  const task: Task = {
    id: Math.max(0, ...tasks.map((task) => task.id)) + 1,
    title: input.title,
    completed: false,
    priority: input.priority,
  };

  tasks.push(task);
  return task;
}

function findTaskById(id: number): Task | undefined {
  return tasks.find((task) => task.id === id);
}

function completeTask(id: number): boolean {
  const task = findTaskById(id);

  if (!task) {
    return false;
  }

  task.completed = true;

  return true;
}

function updateTask(id: number, updates: TaskUpdates): Task | undefined {
  const task = findTaskById(id);

  if (!task) {
    return undefined;
  }

  Object.assign(task, updates);
  return task;
}

function deleteTask(id: number): boolean {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}

async function saveTasks(): Promise<void> {
  const json = JSON.stringify(tasks, null, 2);
  await writeFile("tasks.json", json, "utf8");
}

async function loadTasks(): Promise<void> {
  try {
    const json = await readFile("tasks.json", "utf8");
    const savedTasks = JSON.parse(json) as Task[];

    tasks.splice(0, tasks.length, ...savedTasks);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return;
    }

    throw error;
  }
}

function getTasksByPriority(priority: Priority): Task[] {
  return tasks.filter((task) => task.priority === priority);
}

const tasks: Task[] = [];

function isPriority(value: string): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

async function promptForNewTask(): Promise<void> {
  await loadTasks();

  const readline = createInterface({
    input: stdin,
    output: stdout,
  });

  const title = await readline.question("Enter a new task title: ");
  const priority = await readline.question(
    "Enter a priority (low, medium, or high): ",
  );

  if (!isPriority(priority)) {
    console.log("Invalid priority.");
    readline.close();
    return;
  }

  const task = addTask({
    title,
    priority,
  });

  await saveTasks();

  console.log("Created task:", task);
  readline.close();
}

void promptForNewTask();