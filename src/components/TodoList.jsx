import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

export default function TodoList({ onClose }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('auraleaf-todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('auraleaf-todos', JSON.stringify(tasks));
    window.dispatchEvent(new Event('todos-updated'));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: inputValue.trim(), completed: false }]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="todo-widget sidebar-content-inner">
      <div className="todo-header" style={{ display: 'none' }}>
        <span className="todo-title">To Do List</span>
      </div>
      
      <div className="todo-body">
        <form className="todo-form" onSubmit={addTask}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit"><Plus size={18} /></button>
        </form>

        <div className="todo-list">
          {tasks.length === 0 ? (
            <div className="todo-empty">No tasks yet.</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
                <button className="todo-check" onClick={() => toggleTask(task.id)}>
                  {task.completed && <Check size={14} />}
                </button>
                <span className="todo-text">{task.text}</span>
                <button className="todo-delete" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
