import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

export default function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  headerActions,
  children,
  className = '',
  ariaLabel = 'Bottom Sheet',
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef(null);

  if (!isOpen) return null;

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartYRef.current === null || !e.touches || e.touches.length === 0) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartYRef.current = null;
    if (dragOffset > 80) {
      setDragOffset(0);
      if (onClose) onClose();
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div
      className="mobile-sheet-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Sheet'}
    >
      <div
        className={`mobile-bottom-sheet ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="mobile-sheet-drag-zone"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sheet-grabber" />
          <div className="mobile-sheet-header">
            <div className="mobile-sheet-title-wrap">
              {typeof title === 'string' ? (
                <h2 className="mobile-sheet-title">{title}</h2>
              ) : (
                title
              )}
            </div>
            <div className="mobile-sheet-actions">
              {headerActions}
              {onClose && (
                <button
                  type="button"
                  className="btn-sheet-close"
                  onClick={onClose}
                  aria-label="Close panel"
                  title="Close"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mobile-sheet-body">{children}</div>
      </div>
    </div>
  );
}
