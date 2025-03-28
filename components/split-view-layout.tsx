import React, { useState, useEffect, useRef } from 'react';
import { TipTapEditor } from './tiptap-editor';
import { CursorChatInterface } from './cursor-chat-interface';

export function SplitViewLayout() {
  // Default split: 50/50
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState('<p>Welcome to MyLetter!</p>');

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // If mobile view, reset to stacked layout
      if (window.innerWidth < 768) {
        setSplitRatio(1); // Full width for each panel in mobile
      } else if (splitRatio === 1) {
        setSplitRatio(0.5); // Reset to 50/50 if coming from mobile view
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [splitRatio]);

  // Handle divider dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      // Calculate new ratio but constrain between 0.2 and 0.8
      let newRatio = mouseX / containerWidth;
      newRatio = Math.max(0.2, Math.min(0.8, newRatio));
      
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Handle applying content from AI to editor
  const handleApplyContent = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div 
      className="split-view-container" 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        height: '100vh'
      }}
    >
      <div 
        data-testid="left-panel"
        className="left-panel" 
        style={{ 
          width: window.innerWidth < 768 ? '100%' : `${splitRatio * 100}%`,
          overflow: 'auto'
        }}
      >
        <TipTapEditor 
          initialContent={editorContent} 
          onChange={(html) => setEditorContent(html)}
        />
      </div>
      
      <div 
        data-testid="split-divider"
        className="divider" 
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: 'col-resize',
          width: '4px',
          background: '#e5e7eb',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}
      />
      
      <div 
        data-testid="right-panel"
        className="right-panel" 
        style={{ 
          width: window.innerWidth < 768 ? '100%' : `${(1 - splitRatio) * 100}%`,
          overflow: 'auto'
        }}
      >
        <CursorChatInterface onApplyContent={handleApplyContent} />
      </div>
    </div>
  );
}