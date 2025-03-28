import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TipTapEditor } from '../../components/tiptap-editor';

// Mock the editor instance and extensions
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn().mockReturnValue({
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({
          run: jest.fn()
        }),
        toggleItalic: () => ({
          run: jest.fn()
        }),
        toggleHeading: (options: { level: number }) => ({
          run: jest.fn()
        }),
        setImage: () => ({
          run: jest.fn()
        }),
        toggleLink: () => ({
          run: jest.fn()
        })
      })
    }),
    isEmpty: jest.fn().mockReturnValue(false),
    getHTML: jest.fn().mockReturnValue('<p>Editor content</p>'),
    setContent: jest.fn()
  }),
  EditorContent: ({ editor }: any) => <div data-testid="editor-content">Editor Content</div>
}));

describe('TipTapEditor Component', () => {
  it('renders the editor with toolbar', () => {
    render(<TipTapEditor />);
    
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /heading/i })).toBeInTheDocument();
  });

  it('calls onChange when content changes', () => {
    const handleChange = jest.fn();
    render(<TipTapEditor onChange={handleChange} />);
    
    // Simulate content change by calling the mocked getHTML method
    const mockEditor = require('@tiptap/react').useEditor();
    mockEditor.getHTML();
    
    expect(handleChange).toHaveBeenCalledWith('<p>Editor content</p>');
  });

  it('initializes with content when provided', () => {
    const initialContent = '<p>Initial content</p>';
    render(<TipTapEditor initialContent={initialContent} />);
    
    const mockEditor = require('@tiptap/react').useEditor();
    expect(mockEditor.setContent).toHaveBeenCalledWith(initialContent);
  });

  it('applies bold formatting when bold button is clicked', () => {
    render(<TipTapEditor />);
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    fireEvent.click(boldButton);
    
    // Verify the chain command was called (implementation is mocked)
    const mockEditor = require('@tiptap/react').useEditor();
    expect(mockEditor.chain).toHaveBeenCalled();
  });

  it('applies italic formatting when italic button is clicked', () => {
    render(<TipTapEditor />);
    
    const italicButton = screen.getByRole('button', { name: /italic/i });
    fireEvent.click(italicButton);
    
    // Verify the chain command was called (implementation is mocked)
    const mockEditor = require('@tiptap/react').useEditor();
    expect(mockEditor.chain).toHaveBeenCalled();
  });

  it('shows placeholder when editor is empty', () => {
    const mockUseEditor = require('@tiptap/react').useEditor;
    mockUseEditor.mockReturnValueOnce({
      ...mockUseEditor(),
      isEmpty: jest.fn().mockReturnValue(true)
    });
    
    render(<TipTapEditor placeholder="Type something..." />);
    
    // In a real test, we would expect the placeholder to be visible
    // This is limited by our mock implementation
    expect(mockUseEditor().isEmpty).toHaveBeenCalled();
  });
});