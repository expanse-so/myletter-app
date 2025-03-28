import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SplitViewLayout from '../../components/SplitViewLayout';

describe('SplitViewLayout Component', () => {
  const mockLeftPanel = <div data-testid="left-panel">Left panel content</div>;
  const mockRightPanel = <div data-testid="right-panel">Right panel content</div>;
  
  it('renders both panels', () => {
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
      />
    );
    
    // Check if both panels are rendered
    expect(screen.getByTestId('left-panel')).toBeInTheDocument();
    expect(screen.getByTestId('right-panel')).toBeInTheDocument();
    
    // Check if their content is correct
    expect(screen.getByText('Left panel content')).toBeInTheDocument();
    expect(screen.getByText('Right panel content')).toBeInTheDocument();
  });
  
  it('renders with default layout', () => {
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
      />
    );
    
    // Check for split-view-container
    const container = screen.getByTestId('split-view-container');
    expect(container).toBeInTheDocument();
    
    // Check for split-view-left
    const leftContainer = screen.getByTestId('split-view-left');
    expect(leftContainer).toBeInTheDocument();
    
    // Check for split-view-right
    const rightContainer = screen.getByTestId('split-view-right');
    expect(rightContainer).toBeInTheDocument();
  });
  
  it('applies custom classes when provided', () => {
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
        containerClassName="custom-container"
        leftPanelClassName="custom-left"
        rightPanelClassName="custom-right"
      />
    );
    
    // Check if custom classes are applied
    const container = screen.getByTestId('split-view-container');
    expect(container).toHaveClass('custom-container');
    
    const leftContainer = screen.getByTestId('split-view-left');
    expect(leftContainer).toHaveClass('custom-left');
    
    const rightContainer = screen.getByTestId('split-view-right');
    expect(rightContainer).toHaveClass('custom-right');
  });
  
  it('renders resize handle when provided', () => {
    const mockResizeHandle = <div data-testid="resize-handle">≡</div>;
    
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
        resizeHandle={mockResizeHandle}
      />
    );
    
    // Check if resize handle is rendered
    expect(screen.getByTestId('resize-handle')).toBeInTheDocument();
    expect(screen.getByText('≡')).toBeInTheDocument();
  });
  
  it('respects initial sizes if provided', () => {
    const initialLeftWidth = '30%';
    const initialRightWidth = '70%';
    
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
        initialLeftWidth={initialLeftWidth}
        initialRightWidth={initialRightWidth}
      />
    );
    
    // Check if panels have correct initial sizes
    const leftContainer = screen.getByTestId('split-view-left');
    const rightContainer = screen.getByTestId('split-view-right');
    
    expect(leftContainer).toHaveStyle(`width: ${initialLeftWidth}`);
    expect(rightContainer).toHaveStyle(`width: ${initialRightWidth}`);
  });
  
  it('uses default sizes when none provided', () => {
    render(
      <SplitViewLayout
        leftPanel={mockLeftPanel}
        rightPanel={mockRightPanel}
      />
    );
    
    // Check if panels have default sizes
    const leftContainer = screen.getByTestId('split-view-left');
    const rightContainer = screen.getByTestId('split-view-right');
    
    // Default values should be applied
    expect(leftContainer).toHaveStyle('flex: 1');
    expect(rightContainer).toHaveStyle('flex: 1');
  });
});