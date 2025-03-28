import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsletterSave } from './newsletter-save';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(),
          single: vi.fn(() => ({
            data: { id: '123', title: 'Test Newsletter', content: '<p>Test content</p>' },
            error: null
          }))
        }))
      }))
    })),
  }))
}));

describe('NewsletterSave Component', () => {
  const mockContent = '<p>This is a test newsletter content.</p>';
  const mockTitle = 'Test Newsletter';
  const mockOnSaveComplete = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the save button', () => {
    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('shows loading state when save is in progress', async () => {
    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('calls onSaveComplete when save is successful', async () => {
    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSaveComplete).toHaveBeenCalledWith('123');
    });
  });

  it('shows error message when save fails', async () => {
    // Override the mock to return an error
    vi.mocked(createClient).mockImplementationOnce(() => ({
      from: vi.fn(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(),
            single: vi.fn(() => ({
              data: null,
              error: new Error('Failed to save')
            }))
          }))
        }))
      })),
    }));

    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
    expect(mockOnSaveComplete).not.toHaveBeenCalled();
  });

  it('shows saved status temporarily after successful save', async () => {
    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    });

    // After some time, the "Saved" text should disappear
    vi.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(screen.queryByText(/saved/i)).not.toBeInTheDocument();
    });
  });

  it('auto-saves when autoSave is enabled', async () => {
    vi.useFakeTimers();

    render(
      <NewsletterSave 
        content={mockContent}
        title={mockTitle}
        onSaveComplete={mockOnSaveComplete}
        autoSave
        autoSaveInterval={5000}
      />
    );

    // Advance timers by autoSaveInterval
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(mockOnSaveComplete).toHaveBeenCalledWith('123');
    });

    vi.useRealTimers();
  });
});