import React from 'react';
import { X, StickyNote, ListTodo } from 'lucide-react';
import StickyNotes from './StickyNotes';
import TodoList from './TodoList';

export default function Sidebar({ activeTab, setActiveTab }) {
  if (!activeTab) return null;

  return (
    <div className="tools-sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          <ListTodo size={16} /> To Do
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <StickyNote size={16} /> Notes
        </button>
        <div style={{ flex: 1 }}></div>
        <button className="sidebar-close" onClick={() => setActiveTab(null)}>
          <X size={18} />
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'todo' && <TodoList onClose={() => setActiveTab(null)} isSidebar={true} />}
        {activeTab === 'notes' && <StickyNotes onClose={() => setActiveTab(null)} isSidebar={true} />}
      </div>
    </div>
  );
}
