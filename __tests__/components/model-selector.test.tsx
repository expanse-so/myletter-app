import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModelSelector } from '../../components/model-selector';

// Mock available models data
const mockModels = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    context_length: 128000,
    cost_tier: 'low'
  },
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    context_length: 200000,
    cost_tier: 'high'
  }
];

describe('ModelSelector Component', () => {
  it('renders the model selector with default value', () => {
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={jest.fn()}
      />
    );
    
    // Check if the component renders with the selected model
    expect(screen.getByText('GPT-4o Mini')).toBeInTheDocument();
  });

  it('shows dropdown when clicked', () => {
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={jest.fn()}
      />
    );
    
    // Click the selector to open dropdown
    fireEvent.click(screen.getByText('GPT-4o Mini'));
    
    // Dropdown should now be visible with all options
    expect(screen.getByText('Claude 3.7 Sonnet')).toBeInTheDocument();
  });

  it('calls onModelChange when a different model is selected', () => {
    const handleModelChange = jest.fn();
    
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={handleModelChange}
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('GPT-4o Mini'));
    
    // Select different model
    fireEvent.click(screen.getByText('Claude 3.7 Sonnet'));
    
    // Check if handler was called with correct model ID
    expect(handleModelChange).toHaveBeenCalledWith('claude-3.7-sonnet');
  });

  it('handles no models gracefully', () => {
    render(
      <ModelSelector 
        models={[]}
        selectedModel=""
        onModelChange={jest.fn()}
      />
    );
    
    // Should show a default or placeholder text
    expect(screen.getByText(/No models available/i)).toBeInTheDocument();
  });
  
  it('displays disabled state correctly', () => {
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={jest.fn()}
        disabled={true}
      />
    );
    
    // The selector should appear disabled
    const selector = screen.getByRole('button');
    expect(selector).toHaveAttribute('disabled');
    
    // Clicking should not open dropdown when disabled
    fireEvent.click(selector);
    expect(screen.queryByText('Claude 3.7 Sonnet')).not.toBeInTheDocument();
  });
  
  it('shows cost tier indicators', () => {
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={jest.fn()}
        showCostTier={true}
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('GPT-4o Mini'));
    
    // Should show cost indicators
    expect(screen.getByText(/low/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });
  
  it('groups models by provider when specified', () => {
    render(
      <ModelSelector 
        models={mockModels}
        selectedModel="gpt-4o-mini"
        onModelChange={jest.fn()}
        groupByProvider={true}
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('GPT-4o Mini'));
    
    // Should show provider groups
    expect(screen.getByText(/OpenAI/i)).toBeInTheDocument();
    expect(screen.getByText(/Anthropic/i)).toBeInTheDocument();
  });
});