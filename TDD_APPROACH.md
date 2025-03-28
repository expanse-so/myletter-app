# Test-Driven Development Approach for MyLetter App

## Overview

Moving forward, all new features for the MyLetter app will be developed using a strict Test-Driven Development (TDD) approach. This document outlines the process we'll follow for each new feature implementation.

## The TDD Process

### 1. Write the Test First

Before writing any implementation code, we will write tests that define the expected behavior of the feature. Tests should:

- Cover all expected functionality
- Define edge cases and error scenarios
- Be specific and focused on a single aspect of functionality
- Use clear, descriptive names

### 2. Run the Tests (They Should Fail)

After writing tests, we'll run them to confirm they fail as expected, since we haven't implemented the feature yet. This confirms that:

- The tests are actually testing something
- They're not accidentally passing due to existing functionality

### 3. Implement the Minimal Code to Pass the Tests

We'll then write the implementation code with the sole purpose of making the tests pass. This code should:

- Be focused only on the requirements defined by the tests
- Be as simple as possible to satisfy the tests
- Not include extra features or "nice-to-haves" not covered by tests

### 4. Run the Tests Again (They Should Pass)

After implementing the code, we'll run the tests again to verify they now pass. This confirms that:

- The implementation meets the requirements
- No regressions have been introduced

### 5. Refactor the Code

Once the tests are passing, we can refactor the code to improve its quality without changing its behavior. During refactoring:

- Tests should continue to pass
- Code should become cleaner, more readable, and more maintainable
- Performance or efficiency improvements can be made

### 6. Verify with GitHub Actions

For full verification, we'll use our GitHub Actions workflow to run the complete test suite and provide documented test results.

## Practical Example: Newsletter Saving Feature

Here's how we'll apply this process to the newsletter saving feature:

### 1. Writing Tests First

```typescript
// __tests__/features/newsletter-saving.test.tsx
describe('Newsletter Saving', () => {
  test('Save button appears in the editor toolbar', () => {
    render(<TipTapEditor />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  
  test('Clicking save button triggers save action', () => {
    const mockSave = jest.fn();
    render(<TipTapEditor onSave={mockSave} />);
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
  
  test('Save action sends content to API', async () => {
    const mockApi = jest.fn().mockResolvedValue({ id: '123' });
    render(<TipTapEditor saveApi={mockApi} />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.any(String)
      }));
    });
  });
  
  test('Shows success notification after saving', async () => {
    render(<TipTapEditor />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Newsletter saved!')).toBeInTheDocument();
    });
  });
  
  test('Shows error notification if save fails', async () => {
    const mockApi = jest.fn().mockRejectedValue(new Error('Failed to save'));
    render(<TipTapEditor saveApi={mockApi} />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save newsletter')).toBeInTheDocument();
    });
  });
});
```

### 2. Run the Tests (They Will Fail)

We'll run the tests to verify they fail as expected since we haven't implemented the feature yet.

### 3. Implement the Feature

```typescript
// components/tiptap-editor.tsx
interface TipTapEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  onSave?: (content: string) => void;
  saveApi?: (data: { content: string }) => Promise<any>;
}

export function TipTapEditor({
  initialContent,
  onChange,
  placeholder,
  onSave,
  saveApi = defaultSaveApi,
}: TipTapEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // ... existing editor code ...
  
  const handleSave = async () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    
    // Call onSave prop if provided
    if (onSave) {
      onSave(content);
    }
    
    // Call API save function
    try {
      setSaveStatus('saving');
      await saveApi({ content });
      setSaveStatus('success');
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to save newsletter');
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };
  
  return (
    <div className="tiptap-editor">
      {/* ... existing editor rendering ... */}
      
      <div className="tiptap-editor-toolbar">
        {/* ... existing toolbar buttons ... */}
        
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="save-button"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {saveStatus === 'success' && (
        <div className="save-notification success">Newsletter saved!</div>
      )}
      
      {saveStatus === 'error' && (
        <div className="save-notification error">{errorMessage || 'Failed to save newsletter'}</div>
      )}
    </div>
  );
}
```

### 4. Run the Tests Again (They Should Now Pass)

We'll run the tests to verify they now pass, confirming our implementation meets the requirements.

### 5. Refactor

We might refactor to:
- Extract the save notification into a separate component
- Improve the API saving logic
- Add auto-save functionality

### 6. Verify with GitHub Actions

We'll run the complete test suite through GitHub Actions to get documented test results.

## Benefits of This Approach

Following this strict TDD approach provides several benefits:

1. **Clear Requirements**: Tests act as executable specifications
2. **Higher Quality Code**: Code is naturally more modular and testable
3. **Faster Feedback**: Issues are caught early in the development process
4. **Better Design**: Writing tests first leads to better API design
5. **Confident Refactoring**: Tests provide a safety net for improvements
6. **Documentation**: Tests serve as documentation for how code should behave

## Tools and Resources

- **Testing Framework**: Jest + React Testing Library
- **Test Execution**: Local runner and GitHub Actions
- **Documentation**: See `module_core_testing_framework_github_actions.md` for detailed guidance

## Next Steps

We will apply this TDD approach to the following features in order:

1. Newsletter saving functionality
2. Email sending mechanism
3. Basic subscriber management
4. User authentication