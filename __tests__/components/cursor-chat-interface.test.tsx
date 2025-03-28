import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CursorChatInterface } from '../../components/cursor-chat-interface';

// Mock the AI API response
jest.mock('../../app/api/ai/route', () => ({
  POST: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      text: 'AI response content',
      done: true
    })
  })
}));

describe('CursorChatInterface Component', () => {
  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();
  });

  it('renders the chat interface with input field and send button', () => {
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('allows users to type a message', () => {
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    expect(input).toHaveValue('Hello AI');
  });

  it('sends user message when clicking send button', async () => {
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check if user message was added to the chat
    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument();
    });
    
    // Input should be cleared after sending
    expect(input).toHaveValue('');
  });

  it('displays AI response after sending message', async () => {
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    // Send a message
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check if AI response appears
    await waitFor(() => {
      expect(screen.getByText('AI response content')).toBeInTheDocument();
    });
  });

  it('shows loading state while waiting for AI response', async () => {
    // Mock a delayed response
    const mockedPost = require('../../app/api/ai/route').POST;
    mockedPost.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            json: () => Promise.resolve({ text: 'Delayed response', done: true })
          }), 
          100
        )
      )
    );
    
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    // Send a message
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check for loading indicator
    expect(screen.getByText(/Thinking.../i)).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
    });
  });

  it('allows clicking on AI message to apply content', async () => {
    const handleApplyContent = jest.fn();
    render(<CursorChatInterface onApplyContent={handleApplyContent} />);
    
    // Send a message and get response
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('AI response content')).toBeInTheDocument();
    });
    
    // Click on AI message
    fireEvent.click(screen.getByText('AI response content'));
    
    // Check if onApplyContent was called with the AI message content
    expect(handleApplyContent).toHaveBeenCalledWith('AI response content');
  });
  
  it('handles errors gracefully', async () => {
    // Mock an error response
    const mockedPost = require('../../app/api/ai/route').POST;
    mockedPost.mockRejectedValueOnce(new Error('API Error'));
    
    render(<CursorChatInterface onApplyContent={jest.fn()} />);
    
    // Send a message
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error: API Error/i)).toBeInTheDocument();
    });
  });
});