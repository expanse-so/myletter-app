import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CursorChatInterface } from '../../components/cursor-chat-interface';

// Mock the API call
jest.mock('../../utils/api', () => ({
  sendMessageToAI: jest.fn().mockResolvedValue({ text: 'AI response', error: null }),
}));

const mockSendMessageToAI = require('../../utils/api').sendMessageToAI;

describe('CursorChatInterface Component', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockSendMessageToAI.mockClear();
  });

  // Test basic rendering
  test('renders chat interface with empty message history', () => {
    render(<CursorChatInterface onSendMessage={jest.fn()} onSelectContent={jest.fn()} />);
    
    // Check if message input is displayed
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    
    // Check if send button is displayed
    expect(screen.getByText('Send')).toBeInTheDocument();
    
    // Initially, there should be no messages
    expect(screen.queryByText('AI:')).not.toBeInTheDocument();
    expect(screen.queryByText('You:')).not.toBeInTheDocument();
  });

  // Test with initial message history
  test('renders with initial message history', () => {
    const initialMessages = [
      { sender: 'user', text: 'Hello AI' },
      { sender: 'ai', text: 'Hello human' },
    ];
    
    render(
      <CursorChatInterface
        initialMessages={initialMessages}
        onSendMessage={jest.fn()}
        onSelectContent={jest.fn()}
      />
    );
    
    // Check if messages are displayed
    expect(screen.getByText('You: Hello AI')).toBeInTheDocument();
    expect(screen.getByText('AI: Hello human')).toBeInTheDocument();
  });

  // Test user input and message sending
  test('captures user input and sends message', async () => {
    const mockSendMessage = jest.fn();
    
    render(
      <CursorChatInterface
        onSendMessage={mockSendMessage}
        onSelectContent={jest.fn()}
      />
    );
    
    // Type a message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Send the message
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    // Check if onSendMessage was called with the message
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
    
    // Input should be cleared after sending
    expect(input.value).toBe('');
  });

  // Test message sending on Enter key
  test('sends message on Enter key press', () => {
    const mockSendMessage = jest.fn();
    
    render(
      <CursorChatInterface
        onSendMessage={mockSendMessage}
        onSelectContent={jest.fn()}
      />
    );
    
    // Type a message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Check if onSendMessage was called with the message
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });

  // Test handling loading state
  test('displays loading state while waiting for AI response', async () => {
    // Mock API with a delayed response
    mockSendMessageToAI.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ text: 'Delayed response', error: null }), 100);
      });
    });
    
    render(
      <CursorChatInterface
        onSendMessage={jest.fn()}
        onSelectContent={jest.fn()}
      />
    );
    
    // Type and send a message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send'));
    
    // Loading indicator should be displayed
    expect(await screen.findByText('AI is thinking...')).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  // Test error handling
  test('displays error message when AI response fails', async () => {
    // Mock API with an error
    mockSendMessageToAI.mockResolvedValue({ text: null, error: 'API error' });
    
    render(
      <CursorChatInterface
        onSendMessage={jest.fn()}
        onSelectContent={jest.fn()}
      />
    );
    
    // Type and send a message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send'));
    
    // Error message should be displayed
    expect(await screen.findByText('Error: API error')).toBeInTheDocument();
  });
});