import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmailPreview } from './email-preview';

// Mock the email generator functions
vi.mock('@/lib/email-generator', () => ({
  generateEmailHtml: vi.fn(() => '<html><body><h1>Newsletter Title</h1><p>Test content</p></body></html>'),
  generatePlainTextEmail: vi.fn(() => 'Newsletter Title\n\nTest content'),
  addUnsubscribeLink: vi.fn((content) => `${content}\n\nUnsubscribe link`)
}));

describe('EmailPreview Component', () => {
  const sampleContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Test content' }]
      }
    ]
  };
  
  const props = {
    content: sampleContent,
    title: 'Newsletter Title',
    senderName: 'Test Sender',
    senderEmail: 'test@example.com'
  };

  it('renders with show preview button', () => {
    render(<EmailPreview {...props} />);
    
    expect(screen.getByText('Email Preview')).toBeInTheDocument();
    expect(screen.getByText('Show Preview')).toBeInTheDocument();
  });

  it('toggles preview when button is clicked', () => {
    render(<EmailPreview {...props} />);
    
    // Initially, preview should be hidden
    expect(screen.queryByText('HTML')).not.toBeInTheDocument();
    
    // Click to show preview
    fireEvent.click(screen.getByText('Show Preview'));
    
    // Now preview should be visible
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('Plain Text')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    
    // Click to hide preview
    fireEvent.click(screen.getByText('Hide Preview'));
    
    // Preview should be hidden again
    expect(screen.queryByText('HTML')).not.toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<EmailPreview {...props} />);
    
    // Show the preview
    fireEvent.click(screen.getByText('Show Preview'));
    
    // Check initial tab
    expect(screen.getByTitle('Email HTML Preview')).toBeInTheDocument();
    
    // Switch to Plain Text tab
    fireEvent.click(screen.getByText('Plain Text'));
    expect(screen.getByText('Newsletter Title')).toBeInTheDocument();
    
    // Switch to Source tab
    fireEvent.click(screen.getByText('Source'));
    expect(screen.getByText('<html><body><h1>Newsletter Title</h1><p>Test content</p></body></html>')).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(<EmailPreview {...props} />);
    
    expect(screen.getByText('Send Test Email')).toBeInTheDocument();
    expect(screen.getByText('Copy HTML')).toBeInTheDocument();
    expect(screen.getByText('Copy Plain Text')).toBeInTheDocument();
  });
});