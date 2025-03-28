import React, { useState, useEffect, useRef } from 'react';
import { TipTapEditor } from './tiptap-editor';
import { CursorChatInterface } from './cursor-chat-interface';

export function SplitViewLayout() {
  // State for the ratio between left and right panels
  const [leftPanelFlex, setLeftPanelFlex] = useState(2);
  const [rightPanelFlex, setRightPanelFlex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState('<p>Welcome to MyLetter!</p>');

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
      
      // Calculate new flex values
      const leftFlex = mouseX / (containerWidth - mouseX);
      
      // Ensure minimum panel sizes (around 20%)
      const minFlex = 0.25;
      if (leftFlex > minFlex && 1/leftFlex > minFlex) {
        setLeftPanelFlex(leftFlex * rightPanelFlex);
        setRightPanelFlex(rightPanelFlex);
      }
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
  }, [isDragging, rightPanelFlex]);

  // Handle sending message from chat interface
  const handleSendMessage = (message: string) => {
    // Process the message - in a real app this would likely interact with an API
    console.log('Message sent:', message);
  };

  // Handle applying content from AI to editor
  const handleSelectContent = (content: string) => {
    setEditorContent(content);
  };

  // Handle editor content changes
  const handleEditorChange = (html: string) => {
    setEditorContent(html);
  };

  return (
    <div 
      className="split-view-container" 
      ref={containerRef}
      data-testid="split-view-container"
      style={{ 
        display: 'flex',
        height: '100vh'
      }}
    >
      <div 
        data-testid="left-panel"
        className="left-panel" 
        style={{ 
          flex: leftPanelFlex.toString(),
          overflow: 'auto'
        }}
      >
        <TipTapEditor 
          initialContent={editorContent} 
          onChange={handleEditorChange}
        />
      </div>
      
      <div 
        data-testid="panel-resizer"
        className="resizer" 
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: 'col-resize',
          width: '4px',
          background: '#e5e7eb'
        }}
      />
      
      <div 
        data-testid="right-panel"
        className="right-panel" 
        style={{ 
          flex: rightPanelFlex.toString(),
          overflow: 'auto'
        }}
      >
        <CursorChatInterface 
          onSendMessage={handleSendMessage}
          onSelectContent={handleSelectContent}
        />
      </div>
    </div>
  );
}