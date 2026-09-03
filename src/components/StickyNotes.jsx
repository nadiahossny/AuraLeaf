import React, { useState, useEffect } from 'react';
import { X, Plus, Palette } from 'lucide-react';

// Tinted dark glass to ensure white text is always readable against any background
const COLORS = ['rgba(15, 23, 42, 0.85)', 'rgba(12, 74, 110, 0.85)', 'rgba(20, 83, 45, 0.85)', 'rgba(88, 28, 135, 0.85)'];

function SidebarNote({ note, updateNote, deleteNote, changeColor }) {
  const [showColors, setShowColors] = useState(false);
  
  return (
    <div className="sticky-note sidebar-widget" style={{ backgroundColor: note.color, position: 'relative' }}>
      <div className="note-header" style={{ cursor: 'default' }}>
        <div className="note-actions" style={{ marginLeft: 'auto' }}>
          <div className="color-picker-container" onMouseLeave={() => setShowColors(false)}>
            <button 
              className="btn-icon" 
              onClick={() => setShowColors(!showColors)}
              title="Change Color"
            >
              <Palette size={14} />
            </button>
            {showColors && (
              <div className="color-palette">
                {COLORS.map(c => (
                  <div 
                    key={c} 
                    className="color-swatch" 
                    style={{ backgroundColor: c }}
                    onClick={() => { changeColor(note.id, c); setShowColors(false); }}
                  />
                ))}
              </div>
            )}
          </div>
          <button className="btn-icon btn-delete-note" onClick={() => deleteNote(note.id)} title="Delete Note">
            <X size={16}/>
          </button>
        </div>
      </div>
      <textarea 
        value={note.text}
        onChange={(e) => updateNote(note.id, e.target.value)}
        placeholder="Type your note here..."
        className="note-textarea"
        spellCheck="false"
      />
    </div>
  );
}

export default function StickyNotes({ onClose }) {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('auraleaf-notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [{ id: 1, text: '', color: COLORS[0] }];
  });
  

  useEffect(() => {
    localStorage.setItem('auraleaf-notes', JSON.stringify(notes));
  }, [notes]);


  const addNote = () => {
    setNotes([...notes, { id: Date.now(), text: '', color: COLORS[0] }]);
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const changeColor = (id, color) => {
    setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
  };

  return (
    <div className="notes-sidebar-container sidebar-content-inner">
      <div className="notes-sidebar-header" style={{ display: 'none' }}>
        <span className="todo-title">Notes</span>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button onClick={addNote} className="btn-icon" title="New Note"><Plus size={16}/></button>
        </div>
      </div>
      
      {/* Moved the add note button outside for sidebar */}
      <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <button 
          onClick={addNote} 
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.4)', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Add Note
        </button>
      </div>

      <div className="notes-list">
        {notes.map(note => (
          <SidebarNote 
            key={note.id} 
            note={note} 
            updateNote={updateNote} 
            deleteNote={deleteNote} 
            changeColor={changeColor}
          />
        ))}
      </div>
    </div>
  );
}
