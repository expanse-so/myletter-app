import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: '123', newsletter_id: '456', email: 'test@example.com', name: 'Test User', status: 'active' },
      error: null,
    }),
  })),
}));

describe('Subscribe API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe a new user', async () => {
    const requestBody = {
      newsletter_id: '456',
      email: 'test@example.com',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(expect.objectContaining({
      id: '123',
      newsletter_id: '456',
      email: 'test@example.com',
      name: 'Test User',
    }));
  });

  it('should validate the request body', async () => {
    const requestBody = {
      newsletter_id: '456',
      // Missing email
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
  });
});