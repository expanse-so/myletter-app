import { NextRequest } from 'next/server';
import { POST } from '../../app/api/ai/route';
import * as aiConfig from '../../app/api/ai/config';

// Mock Next.js Response and Request classes
jest.mock('next/server', () => {
  const json = jest.fn().mockImplementation((data) => ({
    status: 200,
    body: JSON.stringify(data),
    headers: new Map(),
  }));
  
  const NextResponse = {
    json,
    error: jest.fn().mockImplementation(() => ({
      status: 500,
      body: 'Server Error',
      headers: new Map(),
    })),
  };
  
  return {
    NextResponse,
    NextRequest: class {
      private body;
      
      constructor(body) {
        this.body = body;
      }
      
      async json() {
        return this.body;
      }
    },
  };
});

// Mock OpenAI and other AI providers
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Mock OpenAI response',
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => 'Mock Google response',
          },
        }),
      }),
    })),
  };
});

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GOOGLE_API_KEY = 'test-google-key';

describe('AI API Route', () => {
  // Test basic request handling
  test('handles valid message request with default model', async () => {
    const request = new NextRequest({
      message: 'Test message',
      model: 'gpt-4o',
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('text');
    expect(JSON.parse(response.body).error).toBeNull();
  });

  // Test with invalid model
  test('returns error when an invalid model is specified', async () => {
    const request = new NextRequest({
      message: 'Test message',
      model: 'non-existent-model',
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200); // API returns 200 even for errors to handle them client-side
    expect(JSON.parse(response.body)).toHaveProperty('error');
    expect(JSON.parse(response.body).text).toBeNull();
  });

  // Test with empty message
  test('returns error when message is empty', async () => {
    const request = new NextRequest({
      message: '',
      model: 'gpt-4o',
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });

  // Test with missing message
  test('returns error when message is missing', async () => {
    const request = new NextRequest({
      model: 'gpt-4o',
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });

  // Test with content type parameter
  test('uses appropriate system prompt for content type', async () => {
    // Spy on the getSystemPrompt method
    const spyGetSystemPrompt = jest.spyOn(aiConfig, 'getSystemPrompt');
    
    const request = new NextRequest({
      message: 'Test message',
      model: 'gpt-4o',
      contentType: 'newsletter',
    });
    
    await POST(request);
    
    // Verify getSystemPrompt was called with the right content type
    expect(spyGetSystemPrompt).toHaveBeenCalledWith('newsletter');
    
    // Clean up
    spyGetSystemPrompt.mockRestore();
  });

  // Test with Google model
  test('handles Google model requests', async () => {
    const request = new NextRequest({
      message: 'Test message',
      model: 'gemini-1.5-pro',
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('text');
  });

  // Test server error handling
  test('handles server errors gracefully', async () => {
    // Force an error by removing the API key
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    const request = new NextRequest({
      message: 'Test message',
      model: 'gpt-4o',
    });
    
    const response = await POST(request);
    
    // API should still return a structured response with error
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('error');
    
    // Restore API key
    process.env.OPENAI_API_KEY = originalKey;
  });
});