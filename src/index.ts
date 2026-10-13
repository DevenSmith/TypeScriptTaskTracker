const projectName: string = "TypeScript Task Tracker";

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

const firstTask: Task = {
    id: 1,
    title: "Learn Typescript Basics",
    completed: false,
}

const tasks: Task[] = [firstTask];

console.log(`Welcome to the ${projectName}!`);
console.log(tasks);
