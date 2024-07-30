const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(bodyParser.json());

const dataFile = 'tasks.json';

const loadTasks = () => {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile));
  }
  return [];
};

const saveTasks = (tasks) => {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
};

app.get('/tasks', (req, res) => {
  res.json(loadTasks());
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (task) {
    const tasks = loadTasks();
    const newTask = { id: Date.now(), task, completed: false };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
  } else {
    res.status(400).json({ error: 'Task is required' });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], task, completed };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== parseInt(id));
  saveTasks(tasks);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
