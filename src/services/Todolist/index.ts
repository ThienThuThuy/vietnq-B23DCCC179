export interface Task {
    id: number;
    title: string;
    description: string;
    color: string;
  }
  
  export const initialTasks: Task[] = [
    { id: 1, title: "React", description: "Learn all basic concepts of React", color: "#6495ED" },
    { id: 2, title: "Python", description: "Debugging in Python project", color: "#FFD700" },
    { id: 3, title: "Maths", description: "Learn and practice some concepts of Maths", color: "#32CD32" },
  ];
  