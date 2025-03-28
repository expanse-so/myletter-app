import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CursorChatInterface from '../../components/CursorChatInterface';

// Mock the API functions
jest.mock('../../utils/api', () => ({
  sendMessageToAI: jest.fn().mockResolvedValue({
    message: 'This is a response from the AI',
    success: true
  })
}));

describe('CursorChatInterface Component', () => {
  const mockOnApplyToEditor = jest.fn();
  const mockSelectedModel = 'gpt-4';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the chat interface', () => {
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Check if component renders with input and button
    expect(screen.getByPlaceholderText(/ask for help/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
  
  it('allows user input and sends messages', async () => {
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Type a message
    const inputField = screen.getByPlaceholderText(/ask for help/i);
    fireEvent.change(inputField, { target: { value: 'Hello AI' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check if the user message is displayed
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
    
    // Wait for the AI response
    await waitFor(() => {
      expect(screen.getByText('This is a response from the AI')).toBeInTheDocument();
    });
  });
  
  it('displays loading state while waiting for AI response', async () => {
    // Make the API response slower
    const mockedSendMessage = require('../../utils/api').sendMessageToAI;
    mockedSendMessage.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            message: 'This is a response from the AI',
            success: true
          }), 
          100
        )
      )
    );
    
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText(/ask for help/i);
    fireEvent.change(inputField, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check for loading indicator
    expect(screen.getByText(/thinking.../i)).toBeInTheDocument();
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.getByText('This is a response from the AI')).toBeInTheDocument();
      expect(screen.queryByText(/thinking.../i)).not.toBeInTheDocument();
    });
  });
  
  it('allows applying AI responses to the editor', async () => {
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText(/ask for help/i);
    fireEvent.change(inputField, { target: { value: 'Generate some text' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Wait for the AI response
    await waitFor(() => {
      expect(screen.getByText('This is a response from the AI')).toBeInTheDocument();
    });
    
    // Find the Apply button and click it
    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);
    
    // Verify onApplyToEditor was called with the AI's response
    expect(mockOnApplyToEditor).toHaveBeenCalledWith('This is a response from the AI');
  });
  
  it('handles API errors gracefully', async () => {
    // Mock an API error
    const mockedSendMessage = require('../../utils/api').sendMessageToAI;
    mockedSendMessage.mockRejectedValueOnce(new Error('API error'));
    
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText(/ask for help/i);
    fireEvent.change(inputField, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  
  it('displays messages with correct sender information', async () => {
    render(
      <CursorChatInterface 
        selectedModel={mockSelectedModel}
        onApplyToEditor={mockOnApplyToEditor}
      />
    );
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText(/ask for help/i);
    fireEvent.change(inputField, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check for user message
    const userMessage = screen.getByText('Hello AI');
    expect(userMessage).toBeInTheDocument();
    
    // Wait for AI response
    await waitFor(() => {
      const aiMessage = screen.getByText('This is a response from the AI');
      expect(aiMessage).toBeInTheDocument();
    });
  });
});