import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      axios.post('/tasks', { task: newTask })
        .then(response => {
          setTasks([...tasks, response.data]);
          setNewTask('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id, completed) => {
    axios.put(`/tasks/${id}`, { completed: !completed })
      .then(response => {
        setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      })
      .catch(error => console.error('Error toggling task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditChange = (e) => {
    setEditingTask({ ...editingTask, task: e.target.value });
  };

  const saveEdit = () => {
    if (editingTask) {
      axios.put(`/tasks/${editingTask.id}`, { task: editingTask.task, completed: editingTask.completed })
        .then(response => {
          setTasks(tasks.map(task => (task.id === editingTask.id ? response.data : task)));
          setEditingTask(null);
        })
        .catch(error => console.error('Error saving task:', error));
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Personal Task Manager</h1>
      
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks"
        className="search-input"
      />

      <div className="task-count">
        <strong>Total Tasks:</strong> {tasks.length}
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            <span
              className={`task ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.task}
            </span>
            <div className="task-buttons">
              <button onClick={() => setEditingTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editingTask && (
        <div className="edit-task">
          <h2>Edit Task</h2>
          <input
            type="text"
            value={editingTask.task}
            onChange={handleEditChange}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
