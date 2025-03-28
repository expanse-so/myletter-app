import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: 'Model must be specified' }, { status: 400 });
    }

    // Check API keys depending on the model
    const isOpenAIModel = model.includes('gpt');
    const isAnthropicModel = model.includes('claude');

    if (isOpenAIModel && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    if (isAnthropicModel && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Anthropic API key is not configured' }, { status: 500 });
    }

    // Send request to the appropriate API
    let apiResponse;
    
    if (isOpenAIModel) {
      apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
    } else if (isAnthropicModel) {
      apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1000
        })
      });
    }

    if (!apiResponse?.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate response' },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    
    // Format response based on provider
    let responseText;
    if (isOpenAIModel) {
      responseText = data.choices[0].message.content;
    } else if (isAnthropicModel) {
      responseText = data.content[0].text;
    }

    return NextResponse.json({
      text: responseText,
      done: true
    });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: `Error generating AI response: ${error.message}` },
      { status: 500 }
    );
  }
}