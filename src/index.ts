const projectName: string = "TypeScript Task Tracker";

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import type {
  NewTask,
  Priority,
  Task,
  TaskUpdates,
} from "./types.js";


function addTask(input: NewTask): Task {
  const task: Task = {
    id: tasks.length + 1,
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

function getTasksByPriority(priority: Priority): Task[] {
  return tasks.filter((task) => task.priority === priority);
}

const firstTask: Task = {
  id: 1,
  title: "Learn Typescript Basics",
  completed: false,
  priority: "high",
};

const tasks: Task[] = [firstTask];

const addedTask = addTask({
  title: "Practice TypeScript functions",
  priority: "medium",
});

console.log("Added task:", addedTask);

const mediumPriorityTasks = getTasksByPriority("medium");
console.log("Medium-priority tasks:", mediumPriorityTasks);

const wasCompleted = completeTask(2);
console.log("Task completed:", wasCompleted);

const wasDeleted = deleteTask(1);
console.log("Task deleted:", wasDeleted);

const updatedTask = updateTask(2, {
  title: "Practice typed functions",
  priority: "high",
});

console.log("Updated task:", updatedTask);
console.log(`Welcome to the ${projectName}!`);
console.log(tasks);

const foundTask = findTaskById(2);
if (foundTask) {
  console.log("Found task title:", foundTask.title);
} else {
  console.log("Task not found.");
}

async function promptForTaskTitle(): Promise<void> {
  const readline = createInterface({
    input: stdin,
    output: stdout,
  });

  const title = await readline.question("Enter a new task title: ");
  console.log("You entered:", title);

  readline.close();
}

void promptForTaskTitle();