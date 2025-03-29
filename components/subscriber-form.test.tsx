import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SubscriberForm } from './subscriber-form';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  },
}));

describe('SubscriberForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<SubscriberForm newsletterId="123" />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('should validate email input', async () => {
    render(<SubscriberForm newsletterId="123" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    // Test empty email
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    
    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission correctly', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: { id: '456', email: 'test@example.com', name: 'Test User', status: 'active' },
      error: null,
    });
    
    vi.mocked(supabase.from().insert).mockReturnValue({
      select: () => mockInsert(),
    });
    
    render(<SubscriberForm newsletterId="123" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
      expect(supabase.from().insert).toHaveBeenCalledWith({
        newsletter_id: '123',
        email: 'test@example.com',
        name: 'Test User',
        status: 'active',
      });
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
    });
  });

  it('should handle subscription error', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Error subscribing' },
    });
    
    vi.mocked(supabase.from().insert).mockReturnValue({
      select: () => mockInsert(),
    });
    
    render(<SubscriberForm newsletterId="123" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error subscribing/i)).toBeInTheDocument();
    });
  });
});

// Helper for TypeScript to recognize the mocked supabase object
const { supabase } = await import('@/lib/supabase');