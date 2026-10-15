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
    const savedData: unknown = JSON.parse(json);

    if (!Array.isArray(savedData) || !savedData.every(isTask)) {
      throw new Error("The tasks file contains invalid data.");
    }

    tasks.splice(0, tasks.length, ...savedData);
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

function isTask(value: unknown): value is Task {
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

function getTasksByPriority(priority: Priority): Task[] {
  return tasks.filter((task) => task.priority === priority);
}

const tasks: Task[] = [];

function isPriority(value: string): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

function listTasks(): void {
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  console.log("\nTasks:");

  for (const task of tasks) {
    const marker = task.completed ? "x" : " ";
    console.log(
      `${task.id}. [${marker}] ${task.title} (${task.priority})`,
    );
  }
}

function parseTaskId(input: string): number | undefined {
  const id = Number(input);

  if (!Number.isInteger(id) || id <= 0) {
    return undefined;
  }

  return id;
}

async function promptForNewTask(
  readline: ReturnType<typeof createInterface>,
): Promise<void> {
  const title = await readline.question("Enter a new task title: ");
  const priority = await readline.question(
    "Enter a priority (low, medium, or high): ",
  );

  if (!isPriority(priority)) {
    console.log("Invalid priority.");
    return;
  }

  const task = addTask({
    title,
    priority,
  });

  await saveTasks();
  console.log("Created task:", task);
}

async function runApp(): Promise<void> {
  const readline = createInterface({
    input: stdin,
    output: stdout,
  });

  await loadTasks();

  let running = true;

  while (running) {
    const command = await readline.question(
      "\nChoose a command (list, add, complete, update, delete, quit): ",
    );

    switch (command.trim().toLowerCase()) {
      case "list":
        listTasks();
        break;

      case "add":
        await promptForNewTask(readline);
        break;

      case "complete": {
        const input = await readline.question("Enter the task ID: ");
        const id = parseTaskId(input);

        if (id === undefined) {
          console.log("Please enter a valid positive task ID.");
          break;
        }

        const completed = completeTask(id);

        if (completed) {
          await saveTasks();
          console.log(`Completed task ${id}.`);
        } else {
          console.log(`Task ${id} was not found.`);
        }

        break;
      }

      case "update": {
        const input = await readline.question("Enter the task ID: ");
        const id = parseTaskId(input);

        if (id === undefined) {
          console.log("Please enter a valid positive task ID.");
          break;
        }

        const existingTask = findTaskById(id);

        if (!existingTask) {
          console.log(`Task ${id} was not found.`);
          break;
        }

        const title = await readline.question(
          "Enter a new title, or press Enter to keep the current title: ",
        );

        const priority = await readline.question(
          "Enter a new priority, or press Enter to keep the current priority: ",
        );

        if (priority !== "" && !isPriority(priority)) {
          console.log("Invalid priority.");
          break;
        }

        const updates: TaskUpdates = {};

        if (title.trim() !== "") {
          updates.title = title.trim();
        }

        if (priority !== "") {
          updates.priority = priority;
        }

        const updatedTask = updateTask(id, updates);

        if (updatedTask) {
          await saveTasks();
          console.log("Updated task:", updatedTask);
        } else {
          console.log(`Task ${id} was not found.`);
        }

        break;
      }

      case "delete": {
        const input = await readline.question("Enter the task ID: ");
        const id = parseTaskId(input);

        if (id === undefined) {
          console.log("Please enter a valid positive task ID.");
          break;
        }
        const deleted = deleteTask(id);

        if (deleted) {
          await saveTasks();
          console.log(`Deleted task ${id}.`);
        } else {
          console.log(`Task ${id} was not found.`);
        }

        break;
      }

      case "quit":
        running = false;
        break;

      default:
        console.log("Unknown command.");
    }
  }

  readline.close();
}

void runApp();