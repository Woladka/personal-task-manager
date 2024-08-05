import React, { useState } from 'react';
import './App.css'; // Ensure styles are applied

const App = () => {
  // State hooks
  const [darkMode, setDarkMode] = useState(false);
  const [authMode, setAuthMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = () => {
    if (username && password) {
      setAuthMode(false);
    }
  };

  const handleLogout = () => {
    setAuthMode(true);
  };

  const handleAddTask = () => {
    if (newTask) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          task: newTask,
          dueDate: dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : 'No due date',
        },
      ]);
      setNewTask('');
      setDueDate('');
    }
  };

  const handleEditTask = (id, updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, task: updatedTask } : task
    ));
  };

  const handleDeleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render functions
  if (authMode) {
    return (
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <div className="auth">
          <h1>Login</h1>
          <div className="auth-input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
            />
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
        <footer className="footer">
          Made by: Paras Khurana
        </footer>
      </div>
    );
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1>Task Manager</h1>
        <div className="header-controls">
          <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
            {darkMode ? '🌙' : '🌞'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <div className="input-container">
        <input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button className="add-task" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="task-count">Total tasks: {filteredTasks.length}</div>
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td>{task.task}</td>
              <td>{task.dueDate}</td>
              <td className="task-buttons">
                <button
                  className="edit-task"
                  onClick={() => {
                    const updatedTask = prompt('Edit task:', task.task);
                    if (updatedTask) {
                      handleEditTask(task.id, updatedTask);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-task"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="footer">
        Made by: Paras Khurana
      </footer>
    </div>
  );
};

export default App;
