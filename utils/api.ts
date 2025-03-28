/**
 * API utilities for interacting with backend services
 */

/**
 * Send a message to the AI and get a response
 * 
 * @param message - The user message to send to the AI
 * @param model - The AI model to use (defaults to gpt-4o-mini)
 * @returns Promise with the AI response
 */
export async function sendMessageToAI(message: string, model: string = 'gpt-4o-mini') {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        model
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}