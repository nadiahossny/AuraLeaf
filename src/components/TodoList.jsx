import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { X, GripHorizontal, Plus, Check, Trash2 } from 'lucide-react';

export default function TodoList({ onClose, resetKey }) {
  const nodeRef = useRef(null);
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
  const [position, setPosition] = useState({ x: window.innerWidth / 2 + 250, y: window.innerHeight / 2 - 125 });

  useEffect(() => {
    localStorage.setItem('auraleaf-todos', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (resetKey > 0) {
      setPosition({ x: window.innerWidth / 2 + 250, y: window.innerHeight / 2 - 125 });
    }
  }, [resetKey]);

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

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable 
      nodeRef={nodeRef}
      handle=".todo-header"
      position={position}
      onStop={handleDrag}
      bounds="body"
    >
      <div ref={nodeRef} className="todo-widget">
        <div className="todo-header">
          <GripHorizontal size={16} className="drag-handle" />
          <span className="todo-title">To Do List</span>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={16}/>
          </button>
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
    </Draggable>
  );
}
