import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Palette } from 'lucide-react';
import { useAdaptiveDevice } from '../hooks/useAdaptiveDevice';

// Pastel sticky note colors
const COLORS = [
  'rgba(254, 240, 138, 0.95)',
  'rgba(187, 247, 208, 0.95)',
  'rgba(191, 219, 254, 0.95)',
  'rgba(251, 207, 232, 0.95)',
];

function SidebarNote({ note, updateNote, deleteNote, changeColor, isTouchDevice }) {
  const [showColors, setShowColors] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!showColors) return;
    const handleOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowColors(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showColors]);

  return (
    <div
      className="sticky-note sidebar-widget"
      style={{ backgroundColor: note.color, position: 'relative' }}
    >
      <div className="note-header" style={{ cursor: 'default' }}>
        <div className="note-actions" style={{ marginLeft: 'auto' }}>
          <div
            ref={pickerRef}
            className="color-picker-container"
            onMouseLeave={!isTouchDevice ? () => setShowColors(false) : undefined}
          >
            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowColors((prev) => !prev)}
              title="Change Color"
              aria-label="Change note color"
              aria-expanded={showColors}
            >
              <Palette size={14} />
            </button>
            {showColors && (
              <div className="color-palette" role="menu" aria-label="Note color options">
                {COLORS.map((c, idx) => (
                  <button
                    type="button"
                    key={c}
                    className="color-swatch"
                    style={{ backgroundColor: c }}
                    aria-label={`Color option ${idx + 1}`}
                    onClick={() => {
                      changeColor(note.id, c);
                      setShowColors(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn-icon btn-delete-note"
            onClick={() => deleteNote(note.id)}
            title="Delete Note"
            aria-label="Delete Note"
          >
            <X size={16} />
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
  const { isTouchDevice } = useAdaptiveDevice();
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('auraleaf-notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old dark colors to new pastel colors
        return parsed.map((note) => {
          if (note.color === 'rgba(15, 23, 42, 0.85)') return { ...note, color: COLORS[0] };
          if (note.color === 'rgba(12, 74, 110, 0.85)') return { ...note, color: COLORS[1] };
          if (note.color === 'rgba(20, 83, 45, 0.85)') return { ...note, color: COLORS[2] };
          if (note.color === 'rgba(88, 28, 135, 0.85)') return { ...note, color: COLORS[3] };
          return note;
        });
      } catch (e) {
        return [];
      }
    }
    return [{ id: 1, text: '', color: COLORS[1] }];
  });

  useEffect(() => {
    localStorage.setItem('auraleaf-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), text: '', color: COLORS[1] }]);
  };

  const updateNote = (id, text) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const changeColor = (id, color) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, color } : n)));
  };

  return (
    <div className="notes-sidebar-container sidebar-content-inner">
      <div className="notes-sidebar-header" style={{ display: 'none' }}>
        <span className="todo-title">Notes</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={addNote} className="btn-icon" title="New Note">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="add-note-bar">
        <button type="button" onClick={addNote} className="btn-add-note">
          <Plus size={16} /> Add Note
        </button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <SidebarNote
            key={note.id}
            note={note}
            updateNote={updateNote}
            deleteNote={deleteNote}
            changeColor={changeColor}
            isTouchDevice={isTouchDevice}
          />
        ))}
      </div>
    </div>
  );
}
