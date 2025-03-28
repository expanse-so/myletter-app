import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-4o-mini', editorContent } = await request.json();

    // Handle different model providers
    if (model.startsWith('gpt')) {
      // OpenAI API call
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI writing assistant helping a user write their newsletter. 
            The current content of their editor is: ${editorContent}
            
            When asked to modify content, provide specific changes to make to the editor.
            When asked to generate new content, provide complete sections ready to be inserted.
            Be helpful, concise, and creative.`
          },
          ...messages
        ],
        temperature: 0.7,
      });

      return NextResponse.json({
        response: response.choices[0].message.content,
        model,
        provider: 'openai',
        edits: extractEditorEdits(response.choices[0].message.content)
      });
    } 
    else if (model.startsWith('gemini')) {
      // For Gemini, we'd need to use Google's API
      // This is a placeholder implementation
      // In a real implementation, you would import and use the Google Generative AI library
      
      // Simulate a Gemini response
      const simulatedResponse = `I've analyzed your newsletter content and have some suggestions.
      
      You could improve the introduction by making it more personal. Try something like:
      
      "Welcome to the latest edition of MyLetter, where we explore [your topic]! I'm excited to share with you..."`;
      
      return NextResponse.json({
        response: simulatedResponse,
        model,
        provider: 'google',
        edits: extractEditorEdits(simulatedResponse)
      });
    } 
    else {
      throw new Error(`Unsupported model: ${model}`);
    }
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}

// Helper function to extract potential editor edits from AI response
function extractEditorEdits(response: string | null | undefined) {
  if (!response) return null;
  
  // Simple extraction logic - in a real implementation, 
  // this would be more sophisticated to understand AI's edit intentions
  const edits = [];
  
  // Look for patterns like "Replace X with Y" or "Add X"
  if (response.includes('Replace') || response.includes('replace')) {
    edits.push({ type: 'replace', detected: true });
  }
  
  if (response.includes('Add') || response.includes('add')) {
    edits.push({ type: 'add', detected: true });
  }

  if (response.includes('Remove') || response.includes('remove') || 
      response.includes('Delete') || response.includes('delete')) {
    edits.push({ type: 'delete', detected: true });
  }
  
  return edits.length > 0 ? edits : null;
}