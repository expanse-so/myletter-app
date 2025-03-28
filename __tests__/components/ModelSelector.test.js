import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelSelector from '../../components/ModelSelector';

describe('ModelSelector Component', () => {
  const mockModels = [
    { id: 'model1', name: 'Model 1', provider: 'OpenAI' },
    { id: 'model2', name: 'Model 2', provider: 'OpenAI' },
    { id: 'model3', name: 'Model 3', provider: 'Google' }
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders the model selector with groups', () => {
    render(<ModelSelector models={mockModels} value="model1" onChange={mockOnChange} />);
    
    // Check if component renders with a title
    expect(screen.getByText('Choose a model')).toBeInTheDocument();
    
    // Should have a select element
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('calls onChange when a different model is selected', () => {
    render(<ModelSelector models={mockModels} value="model1" onChange={mockOnChange} />);
    
    // Select a different option
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'model2' } });
    
    // Verify the onChange callback was called with the new value
    expect(mockOnChange).toHaveBeenCalledWith('model2');
  });

  it('displays the currently selected model', () => {
    render(<ModelSelector models={mockModels} value="model2" onChange={mockOnChange} />);
    
    // Check if the correct value is selected
    const selectElement = screen.getByRole('combobox');
    expect(selectElement.value).toBe('model2');
  });

  it('groups models by provider', () => {
    render(<ModelSelector models={mockModels} value="model1" onChange={mockOnChange} />);
    
    // Check for option groups
    const optGroups = screen.getAllByRole('group');
    expect(optGroups.length).toBe(2); // One for OpenAI, one for Google
    
    // Check for provider labels
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('renders correctly when no models are provided', () => {
    render(<ModelSelector models={[]} value="" onChange={mockOnChange} />);
    
    // Should still render the component
    expect(screen.getByText('Choose a model')).toBeInTheDocument();
    
    // Select should be disabled when no models are available
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();
  });
});