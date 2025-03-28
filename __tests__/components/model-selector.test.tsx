import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelSelector } from '../../components/model-selector';

// Define sample models for testing
const sampleModels = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', context_length: 128000, cost_tier: 'high' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', context_length: 128000, cost_tier: 'medium' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', context_length: 1000000, cost_tier: 'high' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', context_length: 200000, cost_tier: 'highest' },
];

describe('ModelSelector Component', () => {
  // Test rendering with default props
  test('renders with default props', () => {
    const mockOnChange = jest.fn();
    
    render(
      <ModelSelector 
        models={sampleModels} 
        selectedModel={sampleModels[0]} 
        onModelChange={mockOnChange} 
      />
    );
    
    // Check if the selected model name is displayed
    expect(screen.getByText('GPT-4o')).toBeInTheDocument();
  });

  // Test displaying cost tier
  test('displays cost tier when showCostTier is true', () => {
    const mockOnChange = jest.fn();
    
    render(
      <ModelSelector 
        models={sampleModels} 
        selectedModel={sampleModels[0]} 
        onModelChange={mockOnChange}
        showCostTier={true}
      />
    );
    
    // Open dropdown to display all options
    fireEvent.click(screen.getByText('GPT-4o'));
    
    // Check cost tiers are displayed
    expect(screen.getByText('(high)')).toBeInTheDocument();
    expect(screen.getByText('(medium)')).toBeInTheDocument();
    expect(screen.getByText('(highest)')).toBeInTheDocument();
  });

  // Test model grouping by provider
  test('groups models by provider when groupByProvider is true', () => {
    const mockOnChange = jest.fn();
    
    render(
      <ModelSelector 
        models={sampleModels} 
        selectedModel={sampleModels[0]} 
        onModelChange={mockOnChange}
        groupByProvider={true}
      />
    );
    
    // Open dropdown to display all options
    fireEvent.click(screen.getByText('GPT-4o'));
    
    // Check if provider group headers are displayed
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
  });

  // Test model selection change
  test('calls onModelChange when a new model is selected', () => {
    const mockOnChange = jest.fn();
    
    render(
      <ModelSelector 
        models={sampleModels} 
        selectedModel={sampleModels[0]} 
        onModelChange={mockOnChange}
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('GPT-4o'));
    
    // Click on a different model
    fireEvent.click(screen.getByText('Gemini 1.5 Pro'));
    
    // Verify onModelChange was called with the correct model
    expect(mockOnChange).toHaveBeenCalledWith(sampleModels[2]);
  });

  // Test disabled state
  test('is disabled when disabled prop is true', () => {
    const mockOnChange = jest.fn();
    
    render(
      <ModelSelector 
        models={sampleModels} 
        selectedModel={sampleModels[0]} 
        onModelChange={mockOnChange}
        disabled={true}
      />
    );
    
    // Get the model selector button and check if it's disabled
    const selectorButton = screen.getByRole('button');
    expect(selectorButton).toBeDisabled();
    
    // Try to click it
    fireEvent.click(selectorButton);
    
    // Ensure dropdown doesn't appear
    expect(screen.queryByText('Gemini 1.5 Pro')).not.toBeInTheDocument();
  });
});