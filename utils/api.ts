interface AIResponse {
  text: string | null;
  error: string | null;
}

export async function sendMessageToAI(message: string): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        model: 'gpt-4o-mini', // Default model
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { text: null, error: errorData.error || 'Failed to get AI response' };
    }

    const data = await response.json();
    return { text: data.text, error: null };
  } catch (err) {
    return { text: null, error: err.message || 'An error occurred' };
  }
}