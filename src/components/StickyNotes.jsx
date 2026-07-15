import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { X, Plus, GripHorizontal, Palette } from 'lucide-react';

const COLORS = ['#fef08a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#e9d5ff'];

function DraggableNote({ note, updateNote, deleteNote, changeColor, handleDrag }) {
  const nodeRef = useRef(null);
  const [showColors, setShowColors] = useState(false);
  
  return (
    <Draggable 
      nodeRef={nodeRef}
      handle=".note-header"
      defaultPosition={note.position}
      onStop={(e, data) => handleDrag(note.id, e, data)}
      bounds="body"
    >
      <div ref={nodeRef} className="sticky-note" style={{ backgroundColor: note.color }}>
        <div className="note-header">
          <GripHorizontal size={16} className="drag-handle" />
          <div className="note-actions">
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
    </Draggable>
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
    return [{ id: 1, text: '', color: '#bbf7d0', position: { x: 50, y: 50 } }];
  });

  useEffect(() => {
    localStorage.setItem('auraleaf-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), text: '', color: '#bbf7d0', position: { x: window.innerWidth / 2 - 125, y: window.innerHeight / 2 - 125 } }]);
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

  const handleDrag = (id, e, data) => {
    setNotes(notes.map(n => n.id === id ? { ...n, position: { x: data.x, y: data.y } } : n));
  };

  return (
    <>
      <div className="notes-controls">
        <button onClick={addNote} className="btn-add-note"><Plus size={16}/> New Note</button>
        <button onClick={onClose} className="btn-close-notes"><X size={16}/> Close Notes</button>
      </div>
      {notes.map(note => (
        <DraggableNote 
          key={note.id} 
          note={note} 
          updateNote={updateNote} 
          deleteNote={deleteNote} 
          changeColor={changeColor}
          handleDrag={handleDrag} 
        />
      ))}
    </>
  );
}
