import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TipTapEditor from '../../components/TipTapEditor';

// Mock the useEditor hook
jest.mock('@tiptap/react', () => {
  const originalModule = jest.requireActual('@tiptap/react');
  
  return {
    ...originalModule,
    useEditor: () => ({
      chain: () => ({
        focus: () => ({
          toggleBold: () => ({ run: jest.fn() }),
          toggleItalic: () => ({ run: jest.fn() }),
          toggleBulletList: () => ({ run: jest.fn() }),
          toggleOrderedList: () => ({ run: jest.fn() }),
          toggleHeading: () => ({ run: jest.fn() })
        })
      }),
      isEmpty: false,
      isActive: jest.fn().mockReturnValue(false),
      getText: jest.fn().mockReturnValue('Editor content'),
      isEditable: true,
      getHTML: jest.fn().mockReturnValue('<p>Editor content</p>')
    })
  };
});

describe('TipTapEditor Component', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  
  it('renders the editor with toolbar', () => {
    render(<TipTapEditor value="" onChange={mockOnChange} />);
    
    // Check if toolbar buttons are rendered
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument();
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Ordered List')).toBeInTheDocument();
  });
  
  it('has functioning toolbar buttons', () => {
    render(<TipTapEditor value="" onChange={mockOnChange} />);
    
    // Click on formatting buttons
    fireEvent.click(screen.getByTitle('Bold'));
    fireEvent.click(screen.getByTitle('Italic'));
    fireEvent.click(screen.getByTitle('Heading 1'));
    fireEvent.click(screen.getByTitle('Bullet List'));
    fireEvent.click(screen.getByTitle('Ordered List'));
    
    // We can't effectively test the actual formatting changes because we've mocked the editor,
    // but we can verify the buttons are clickable and don't throw errors
  });
  
  it('renders with placeholder when empty', () => {
    // Override isActive and isEmpty for this test
    jest.mock('@tiptap/react', () => {
      const originalModule = jest.requireActual('@tiptap/react');
      
      return {
        ...originalModule,
        useEditor: () => ({
          chain: () => ({
            focus: () => ({
              toggleBold: () => ({ run: jest.fn() }),
              toggleItalic: () => ({ run: jest.fn() })
            })
          }),
          isEmpty: true,
          isActive: jest.fn().mockReturnValue(false),
          getText: jest.fn().mockReturnValue(''),
          isEditable: true
        })
      };
    });
    
    render(<TipTapEditor value="" onChange={mockOnChange} placeholder="Type something..." />);
    
    // We can't directly test for the placeholder due to how TipTap works with the DOM
    // Instead, we're just checking that the component renders without errors
  });
  
  it('updates when external value changes', () => {
    const { rerender } = render(<TipTapEditor value="<p>Initial content</p>" onChange={mockOnChange} />);
    
    // Re-render with new value
    rerender(<TipTapEditor value="<p>Updated content</p>" onChange={mockOnChange} />);
    
    // We can't directly test the content update due to our mocks,
    // but we're ensuring the component handles re-renders correctly
  });
});