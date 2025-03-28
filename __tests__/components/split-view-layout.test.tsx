import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SplitViewLayout } from '../../components/split-view-layout';

// Mock child components
jest.mock('../../components/tiptap-editor', () => ({
  TipTapEditor: () => <div data-testid="mock-editor">Editor Content</div>
}));

jest.mock('../../components/cursor-chat-interface', () => ({
  CursorChatInterface: ({ onApplyContent }: { onApplyContent: (content: string) => void }) => (
    <div data-testid="mock-chat">
      Chat Interface
      <button onClick={() => onApplyContent('Sample content')}>Apply Content</button>
    </div>
  )
}));

describe('SplitViewLayout Component', () => {
  it('renders the editor and chat interface', () => {
    render(<SplitViewLayout />);
    
    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chat')).toBeInTheDocument();
  });

  it('renders with default split ratio', () => {
    render(<SplitViewLayout />);
    
    const leftPanel = screen.getByTestId('left-panel');
    const rightPanel = screen.getByTestId('right-panel');
    
    // Default should be close to 50/50
    expect(leftPanel).toHaveStyle('width: 50%');
    expect(rightPanel).toHaveStyle('width: 50%');
  });

  it('allows resizing the panels', () => {
    render(<SplitViewLayout />);
    
    const divider = screen.getByTestId('split-divider');
    
    // Mock the mouse events for dragging
    fireEvent.mouseDown(divider, { clientX: 500 });
    fireEvent.mouseMove(document, { clientX: 600 });
    fireEvent.mouseUp(document);
    
    const leftPanel = screen.getByTestId('left-panel');
    const rightPanel = screen.getByTestId('right-panel');
    
    // After dragging right, left panel should be wider
    expect(leftPanel).toHaveStyle('width: 60%');
    expect(rightPanel).toHaveStyle('width: 40%');
  });

  it('constrains resizing within minimum width limits', () => {
    render(<SplitViewLayout />);
    
    const divider = screen.getByTestId('split-divider');
    
    // Try to drag beyond the minimum limits
    fireEvent.mouseDown(divider, { clientX: 500 });
    fireEvent.mouseMove(document, { clientX: 50 }); // Very far left
    fireEvent.mouseUp(document);
    
    const leftPanel = screen.getByTestId('left-panel');
    
    // Should be constrained to minimum width (e.g., 20%)
    expect(leftPanel).toHaveStyle('width: 20%');
  });

  it('applies content from chat to editor when requested', () => {
    const editorSetContentMock = jest.fn();
    
    // Re-mock TipTapEditor to capture the setContent callback
    jest.mock('../../components/tiptap-editor', () => ({
      TipTapEditor: ({ setContent }: { setContent?: (content: string) => void }) => {
        if (setContent) {
          editorSetContentMock.mockImplementation(setContent);
        }
        return <div data-testid="mock-editor">Editor Content</div>;
      }
    }));
    
    render(<SplitViewLayout />);
    
    // Trigger the apply content function from chat interface
    const applyButton = screen.getByText('Apply Content');
    fireEvent.click(applyButton);
    
    // Check if content was applied to editor
    expect(editorSetContentMock).toHaveBeenCalledWith('Sample content');
  });
  
  it('handles window resize events', () => {
    // Mock window resize
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    
    render(<SplitViewLayout />);
    
    // Trigger window resize
    Object.defineProperty(window, 'innerWidth', { value: 768 });
    fireEvent(window, new Event('resize'));
    
    // Restore original value
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
    
    // Mobile view should stack the panels
    if (window.innerWidth < 768) {
      const leftPanel = screen.getByTestId('left-panel');
      const rightPanel = screen.getByTestId('right-panel');
      
      expect(leftPanel).toHaveStyle('width: 100%');
      expect(rightPanel).toHaveStyle('width: 100%');
    }
  });
});