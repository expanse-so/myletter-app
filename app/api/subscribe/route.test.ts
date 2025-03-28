import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

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

describe('Subscribe API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid subscription', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: { id: '123', email: 'test@example.com', name: 'Test User', status: 'active' },
      error: null,
    });
    
    supabase.from().insert.mockReturnValue({
      select: () => mockInsert(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter_id: '456',
        email: 'test@example.com',
        name: 'Test User',
      }),
    });
    
    const response = await POST(request);
    const responseJson = await response.json();
    
    expect(response.status).toBe(201);
    expect(responseJson.success).toBe(true);
    expect(responseJson.data.id).toBe('123');
    expect(responseJson.data.email).toBe('test@example.com');
    
    expect(supabase.from).toHaveBeenCalledWith('subscribers');
    expect(supabase.from().insert).toHaveBeenCalledWith({
      newsletter_id: '456',
      email: 'test@example.com',
      name: 'Test User',
      status: 'active',
    });
  });

  it('should handle missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
      }),
    });
    
    const response = await POST(request);
    const responseJson = await response.json();
    
    expect(response.status).toBe(400);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error).toMatch(/missing required fields/i);
    
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should handle invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter_id: '456',
        email: 'invalid-email',
      }),
    });
    
    const response = await POST(request);
    const responseJson = await response.json();
    
    expect(response.status).toBe(400);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error).toMatch(/invalid email/i);
    
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should handle duplicate subscription', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    });
    
    supabase.from().insert.mockReturnValue({
      select: () => mockInsert(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter_id: '456',
        email: 'test@example.com',
      }),
    });
    
    const response = await POST(request);
    const responseJson = await response.json();
    
    expect(response.status).toBe(409);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error).toMatch(/already subscribed/i);
  });

  it('should handle server error', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });
    
    supabase.from().insert.mockReturnValue({
      select: () => mockInsert(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter_id: '456',
        email: 'test@example.com',
      }),
    });
    
    const response = await POST(request);
    const responseJson = await response.json();
    
    expect(response.status).toBe(500);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error).toMatch(/error subscribing/i);
  });
});