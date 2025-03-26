export const summary = {
  totalTasks: 0,
  last10Task: [],  
  users: [],
  tasks: { todo: 0, "in progress": 0, completed: 0 },
};

export const tasks = []; 

export const chartData = [
  { name: "High", total: 0 },
  { name: "Medium", total: 0 },
  { name: "Normal", total: 0 },
  { name: "Low", total: 0 },
];

export const user = {
  _id: "",
  name: "Guest",
  title: "User",
  role: "Viewer",
  email: "",
  isAdmin: false,
  tasks: [],
  isActive: true,
};

export const activitiesData = [];
