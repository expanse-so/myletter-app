import { NextRequest } from 'next/server';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { GET, POST, DELETE, PATCH } from './route';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({
      data: [
        {
          id: '123',
          newsletter_id: '456',
          email: 'test@example.com',
          name: 'Test User',
          status: 'active',
          created_at: '2023-01-01T00:00:00Z',
        },
      ],
      error: null,
      count: 1,
    }),
    single: vi.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
  },
}));

describe('Subscribers API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    test('should return subscribers list', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribers?newsletter_id=456', {
        method: 'GET',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual([
        {
          id: '123',
          newsletter_id: '456',
          email: 'test@example.com',
          name: 'Test User',
          status: 'active',
          created_at: '2023-01-01T00:00:00Z',
        },
      ]);
      expect(body.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        total_pages: 1,
      });
    });

    test('should validate query parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribers?page=invalid', {
        method: 'GET',
      });

      const response = await GET(request);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST', () => {
    test('should create a new subscriber', async () => {
      // Mock the insert function for this specific test
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: '123',
          newsletter_id: '456',
          email: 'new@example.com',
          name: 'New User',
          status: 'active',
          created_at: '2023-01-01T00:00:00Z',
        },
        error: null,
      });

      vi.mocked(supabase.from).mockImplementation(() => ({
        ...vi.mocked(supabase.from)(),
        select: vi.fn().mockImplementation((arg) => {
          if (!arg) return mockSelect();
          return mockSingle();
        }),
        insert: mockInsert,
      }));

      mockInsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });

      const requestBody = {
        newsletter_id: '456',
        email: 'new@example.com',
        name: 'New User',
        status: 'active',
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data).toEqual({
        id: '123',
        newsletter_id: '456',
        email: 'new@example.com',
        name: 'New User',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
      });
    });

    test('should validate request body', async () => {
      const requestBody = {
        newsletter_id: '456',
        // Missing email
        name: 'New User',
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE', () => {
    test('should delete a subscriber', async () => {
      // Mock the delete function for this specific test
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockImplementation(() => ({
        ...vi.mocked(supabase.from)(),
        delete: mockDelete,
      }));

      const requestBody = {
        id: '123',
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify(requestBody),
      });

      const response = await DELETE(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });

    test('should validate request body', async () => {
      const requestBody = {
        // Missing id
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify(requestBody),
      });

      const response = await DELETE(request);
      
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH', () => {
    test('should update a subscriber', async () => {
      // Mock the update function for this specific test
      const mockUpdate = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: '123',
          newsletter_id: '456',
          email: 'updated@example.com',
          name: 'Updated User',
          status: 'active',
          created_at: '2023-01-01T00:00:00Z',
        },
        error: null,
      });

      vi.mocked(supabase.from).mockImplementation(() => ({
        ...vi.mocked(supabase.from)(),
        update: mockUpdate,
      }));

      mockUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ select: mockSelect }) });
      mockSelect.mockReturnValue({ single: mockSingle });

      const requestBody = {
        id: '123',
        email: 'updated@example.com',
        name: 'Updated User',
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({
        id: '123',
        newsletter_id: '456',
        email: 'updated@example.com',
        name: 'Updated User',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
      });
    });

    test('should validate request body', async () => {
      const requestBody = {
        // Missing id
        email: 'updated@example.com',
      };

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      
      expect(response.status).toBe(400);
    });
  });
});

// Helper for TypeScript to recognize the mocked supabase object
const { supabase } = await import('@/lib/supabase');