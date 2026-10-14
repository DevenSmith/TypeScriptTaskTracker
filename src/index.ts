const projectName: string = "TypeScript Task Tracker";

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

function addTask(task: Task): void {
  tasks.push(task);
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

function deleteTask(id: number): boolean {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}

const firstTask: Task = {
    id: 1,
    title: "Learn Typescript Basics",
    completed: false,
}

const tasks: Task[] = [firstTask];

addTask({
  id: 2,
  title: "Practice TypeScript functions",
  completed: false,
});

const wasCompleted = completeTask(2);
console.log("Task completed:", wasCompleted);

const wasDeleted = deleteTask(1);
console.log("Task deleted:", wasDeleted);

console.log(`Welcome to the ${projectName}!`);
console.log(tasks);

const foundTask = findTaskById(2);
if (foundTask) {
  console.log("Found task title:", foundTask.title);
} else {
  console.log("Task not found.");
}