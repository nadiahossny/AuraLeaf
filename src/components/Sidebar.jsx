import React from 'react';
import { X, StickyNote, ListTodo } from 'lucide-react';
import StickyNotes from './StickyNotes';
import TodoList from './TodoList';
import MobileBottomSheet from './MobileBottomSheet';
import { useAdaptiveDevice } from '../hooks/useAdaptiveDevice';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { isMobile } = useAdaptiveDevice();

  if (!activeTab) return null;

  const tabSwitcher = (
    <div className="adaptive-tab-switcher" role="tablist" aria-label="Workspace Tools">
      <button
        role="tab"
        aria-selected={activeTab === 'todo'}
        className={`sidebar-tab ${activeTab === 'todo' ? 'active' : ''}`}
        onClick={() => setActiveTab('todo')}
      >
        <ListTodo size={16} /> To Do
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'notes'}
        className={`sidebar-tab ${activeTab === 'notes' ? 'active' : ''}`}
        onClick={() => setActiveTab('notes')}
      >
        <StickyNote size={16} /> Notes
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <MobileBottomSheet
        isOpen={Boolean(activeTab)}
        onClose={() => setActiveTab(null)}
        title={tabSwitcher}
        ariaLabel={activeTab === 'todo' ? 'To Do List' : 'Sticky Notes'}
        className="tools-mobile-sheet"
      >
        <div className="sidebar-content mobile-sheet-content">
          {activeTab === 'todo' && <TodoList onClose={() => setActiveTab(null)} isSidebar={true} />}
          {activeTab === 'notes' && <StickyNotes onClose={() => setActiveTab(null)} isSidebar={true} />}
        </div>
      </MobileBottomSheet>
    );
  }

  return (
    <div className="tools-sidebar" data-adaptive-mode="desktop-sidebar">
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
        <button className="sidebar-close" onClick={() => setActiveTab(null)} aria-label="Close Sidebar">
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
