import { NextRequest } from 'next/server';
import { POST } from '../../app/api/ai/route';

// Mock fetch for OpenAI and other API calls
global.fetch = jest.fn();

describe('AI API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('handles OpenAI API requests correctly', async () => {
    // Mock the fetch implementation for OpenAI API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'This is a response from OpenAI'
            }
          }
        ]
      })
    });
    
    // Create mock request with OpenAI model
    const mockRequest = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, AI' }],
        model: 'gpt-4o-mini'
      })
    });
    
    // Call the API route
    const response = await POST(mockRequest);
    const data = await response.json();
    
    // Check the response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      text: 'This is a response from OpenAI',
      done: true
    });
    
    // Check that fetch was called with the right parameters for OpenAI
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('openai.com'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer ')
        }),
        body: expect.stringContaining('gpt-4o-mini')
      })
    );
  });
  
  it('handles Anthropic API requests correctly', async () => {
    // Mock the fetch implementation for Anthropic API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [
          {
            text: 'This is a response from Anthropic'
          }
        ]
      })
    });
    
    // Create mock request with Anthropic model
    const mockRequest = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, AI' }],
        model: 'claude-3.7-sonnet'
      })
    });
    
    // Call the API route
    const response = await POST(mockRequest);
    const data = await response.json();
    
    // Check the response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      text: 'This is a response from Anthropic',
      done: true
    });
    
    // Check that fetch was called with the right parameters for Anthropic
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('anthropic.com'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-api-key': expect.any(String),
          'anthropic-version': expect.any(String)
        }),
        body: expect.stringContaining('claude-3.7-sonnet')
      })
    );
  });
  
  it('handles missing API keys correctly', async () => {
    // Temporarily remove environment variables
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.OPENAI_API_KEY;
    
    // Create mock request
    const mockRequest = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, AI' }],
        model: 'gpt-4o-mini'
      })
    });
    
    // Call the API route and expect an error
    const response = await POST(mockRequest);
    const data = await response.json();
    
    // Check the error response
    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('API key');
    
    // Restore environment variables
    process.env = originalEnv;
  });
  
  it('handles API failures gracefully', async () => {
    // Mock a failed API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: async () => ({ error: 'Rate limit exceeded' })
    });
    
    // Create mock request
    const mockRequest = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, AI' }],
        model: 'gpt-4o-mini'
      })
    });
    
    // Call the API route
    const response = await POST(mockRequest);
    const data = await response.json();
    
    // Check the error response
    expect(response.status).toBe(429);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Rate limit exceeded');
  });
  
  it('handles request validation errors', async () => {
    // Create invalid mock request (missing messages)
    const mockRequest = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o-mini'
        // messages is missing
      })
    });
    
    // Call the API route
    const response = await POST(mockRequest);
    const data = await response.json();
    
    // Check the validation error response
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('messages');
  });
});