import { sendMessageToAI } from '../../utils/api';

// Mock fetch
global.fetch = jest.fn();

describe('API Utils', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  describe('sendMessageToAI', () => {
    it('sends message to AI and returns response', async () => {
      // Mock a successful response
      const mockResponse = {
        message: 'This is an AI response',
        success: true
      };
      
      // Setup fetch mock to return the successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      // Call the function
      const result = await sendMessageToAI('Hello AI', 'gpt-4');
      
      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello AI',
          model: 'gpt-4'
        })
      });
      
      // Verify the result
      expect(result).toEqual(mockResponse);
    });
    
    it('handles API errors correctly', async () => {
      // Mock a failed response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      // Call the function and expect it to throw
      await expect(sendMessageToAI('Hello AI', 'gpt-4')).rejects.toThrow('Failed to send message: 500 Internal Server Error');
      
      // Verify fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    it('handles network errors correctly', async () => {
      // Mock a network error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Call the function and expect it to throw
      await expect(sendMessageToAI('Hello AI', 'gpt-4')).rejects.toThrow('Network error');
      
      // Verify fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    it('handles JSON parsing errors correctly', async () => {
      // Mock a response with invalid JSON
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });
      
      // Call the function and expect it to throw
      await expect(sendMessageToAI('Hello AI', 'gpt-4')).rejects.toThrow('Invalid JSON');
      
      // Verify fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    it('uses default model if none provided', async () => {
      // Mock a successful response
      const mockResponse = {
        message: 'This is an AI response',
        success: true
      };
      
      // Setup fetch mock
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      // Call the function without providing a model
      await sendMessageToAI('Hello AI');
      
      // Verify fetch was called with the default model
      expect(fetch).toHaveBeenCalledWith('/api/ai', expect.objectContaining({
        body: JSON.stringify({
          message: 'Hello AI',
          model: 'gpt-4o-mini' // Default model
        })
      }));
    });
  });
});