import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SubscriberList } from './subscriber-list';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  }
}));

describe('SubscriberList Component', () => {
  const mockSubscribers = [
    { id: '1', email: 'user1@example.com', name: 'User One', status: 'active', created_at: '2025-01-01', updated_at: '2025-01-01' },
    { id: '2', email: 'user2@example.com', name: 'User Two', status: 'active', created_at: '2025-01-02', updated_at: '2025-01-02' },
    { id: '3', email: 'user3@example.com', name: null, status: 'unsubscribed', created_at: '2025-01-03', updated_at: '2025-01-04' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful fetch
    supabase.from().select.mockResolvedValue({
      data: mockSubscribers,
      error: null
    });
  });

  it('should render the subscriber list', async () => {
    render(<SubscriberList newsletterId="123" />);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
      expect(supabase.from().select).toHaveBeenCalled();
      expect(supabase.from().eq).toHaveBeenCalledWith('newsletter_id', '123');
    });
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
    expect(screen.getByText('Unsubscribed')).toBeInTheDocument();
  });

  it('should handle deleting a subscriber', async () => {
    supabase.from().delete.mockResolvedValue({
      data: { id: '1' },
      error: null
    });
    
    render(<SubscriberList newsletterId="123" />);
    
    await waitFor(() => {
      // Wait for the subscribers to load
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });
    
    // Find delete button for first subscriber and click it
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
      expect(supabase.from().delete).toHaveBeenCalled();
      expect(supabase.from().delete().eq).toHaveBeenCalledWith('id', '1');
    });
  });

  it('should handle bulk operations', async () => {
    supabase.from().delete.mockResolvedValue({
      data: [{ id: '1' }, { id: '2' }],
      error: null
    });
    
    render(<SubscriberList newsletterId="123" />);
    
    await waitFor(() => {
      // Wait for the subscribers to load
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });
    
    // Select multiple subscribers
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First subscriber checkbox
    fireEvent.click(checkboxes[2]); // Second subscriber checkbox
    
    // Click delete selected button
    const bulkDeleteButton = screen.getByRole('button', { name: /delete selected/i });
    fireEvent.click(bulkDeleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
      expect(supabase.from().delete).toHaveBeenCalled();
      expect(supabase.from().delete().in).toHaveBeenCalledWith('id', ['1', '2']);
    });
  });

  it('should handle empty subscriber list', async () => {
    supabase.from().select.mockResolvedValue({
      data: [],
      error: null
    });
    
    render(<SubscriberList newsletterId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/no subscribers found/i)).toBeInTheDocument();
    });
  });

  it('should handle error when fetching subscribers', async () => {
    supabase.from().select.mockResolvedValue({
      data: null,
      error: { message: 'Error fetching subscribers' }
    });
    
    render(<SubscriberList newsletterId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading subscribers/i)).toBeInTheDocument();
      expect(screen.getByText(/error fetching subscribers/i)).toBeInTheDocument();
    });
  });
});