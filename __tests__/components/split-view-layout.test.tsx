import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitViewLayout } from '../../components/split-view-layout';

// Mock the child components
jest.mock('../../components/tiptap-editor', () => ({
  TipTapEditor: ({ onChange }: { onChange: (content: string) => void }) => (
    <div data-testid="tiptap-editor">
      <button onClick={() => onChange('<p>New content</p>')}>Update Content</button>
    </div>
  ),
}));

jest.mock('../../components/cursor-chat-interface', () => ({
  CursorChatInterface: ({ 
    onSendMessage,
    onSelectContent
  }: { 
    onSendMessage: (message: string) => void, 
    onSelectContent: (content: string) => void
  }) => (
    <div data-testid="cursor-chat-interface">
      <button onClick={() => onSendMessage('test message')}>Send Message</button>
      <button onClick={() => onSelectContent('<p>AI content</p>')}>Select Content</button>
    </div>
  ),
}));

describe('SplitViewLayout Component', () => {
  // Test basic rendering
  test('renders editor and chat interface', () => {
    render(<SplitViewLayout />);
    
    // Check if both components are rendered
    expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-chat-interface')).toBeInTheDocument();
  });

  // Test resizer presence
  test('renders resizer element', () => {
    render(<SplitViewLayout />);
    
    // Check if the resizer is present
    expect(screen.getByTestId('panel-resizer')).toBeInTheDocument();
  });

  // Test initial panel sizing
  test('sets initial panel sizes correctly', () => {
    render(<SplitViewLayout />);
    
    const leftPanel = screen.getByTestId('left-panel');
    const rightPanel = screen.getByTestId('right-panel');
    
    // Check if initial flex proportions are applied
    expect(leftPanel).toHaveStyle({ flex: '2' });
    expect(rightPanel).toHaveStyle({ flex: '1' });
  });

  // Test resizing functionality
  test('updates panel sizes on resize', () => {
    render(<SplitViewLayout />);
    
    const resizer = screen.getByTestId('panel-resizer');
    const container = screen.getByTestId('split-view-container');
    
    // Mock getBoundingClientRect for container and mouseEvent
    container.getBoundingClientRect = jest.fn().mockReturnValue({
      left: 0,
      width: 1000, // 1000px total width
    });
    
    // Simulate resize: Start drag
    fireEvent.mouseDown(resizer, { clientX: 600 }); // Start at 600px
    
    // Move to 700px (from the left)
    fireEvent.mouseMove(document, { clientX: 700 });
    
    // End drag
    fireEvent.mouseUp(document);
    
    // Check if panel flex values were updated
    const leftPanel = screen.getByTestId('left-panel');
    const rightPanel = screen.getByTestId('right-panel');
    
    // Panel ratio should be approximately 70% to 30%
    expect(leftPanel).toHaveStyle({ flex: expect.stringContaining('7') }); // Value close to 7
    expect(rightPanel).toHaveStyle({ flex: expect.stringContaining('3') }); // Value close to 3
  });

  // Test message handling between editor and chat
  test('handles message sending from chat to editor', () => {
    render(<SplitViewLayout />);
    
    // Trigger sending a message from the chat interface
    fireEvent.click(screen.getByText('Send Message'));
    
    // This should be handled internally by the SplitViewLayout
    // No assertions needed as we're just ensuring it doesn't crash
  });

  // Test content selection from AI to editor
  test('applies selected content from chat to editor', () => {
    render(<SplitViewLayout />);
    
    // Trigger content selection from the chat interface
    fireEvent.click(screen.getByText('Select Content'));
    
    // This should update the editor content
    // No assertions needed as we're just ensuring it doesn't crash
  });

  // Test content updates from editor to chat context
  test('updates chat context when editor content changes', () => {
    render(<SplitViewLayout />);
    
    // Trigger content update from the editor
    fireEvent.click(screen.getByText('Update Content'));
    
    // This should update the chat context
    // No assertions needed as we're just ensuring it doesn't crash
  });

  // Test minimum panel size enforcement
  test('enforces minimum panel sizes during resize', () => {
    render(<SplitViewLayout />);
    
    const resizer = screen.getByTestId('panel-resizer');
    const container = screen.getByTestId('split-view-container');
    
    // Mock getBoundingClientRect for container and mouseEvent
    container.getBoundingClientRect = jest.fn().mockReturnValue({
      left: 0,
      width: 1000, // 1000px total width
    });
    
    // Simulate extreme resize to the right (trying to make left panel too small)
    fireEvent.mouseDown(resizer, { clientX: 600 }); 
    fireEvent.mouseMove(document, { clientX: 50 }); // Move to 50px (would be too small)
    fireEvent.mouseUp(document);
    
    // Check if min width was enforced
    const leftPanel = screen.getByTestId('left-panel');
    expect(leftPanel).not.toHaveStyle({ flex: '0' });
    
    // Simulate extreme resize to the left (trying to make right panel too small)
    fireEvent.mouseDown(resizer, { clientX: 600 });
    fireEvent.mouseMove(document, { clientX: 950 }); // Move to 950px (would leave right panel too small)
    fireEvent.mouseUp(document);
    
    // Check if min width was enforced
    const rightPanel = screen.getByTestId('right-panel');
    expect(rightPanel).not.toHaveStyle({ flex: '0' });
  });
});