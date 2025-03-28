# Test Files Overview

This document provides a list of all test files in the project, what they test, and their expected outcomes.

## Component Tests

### TipTap Editor
- **File:** `__tests__/components/tiptap-editor.test.tsx`
- **Tests:** Rendering, user interactions, content changes
- **Assertions:**
  - Component renders without crashing
  - Buttons trigger correct formatting commands
  - Content changes are properly tracked and reported
  - Placeholder is displayed when content is empty

### AI Chat Interface
- **File:** `__tests__/components/cursor-chat-interface.test.tsx`
- **Tests:** Rendering, message handling, API interactions
- **Assertions:**
  - Component renders with message history
  - User input is captured correctly
  - Messages are sent to API and responses handled
  - Loading states are managed properly
  - Errors are caught and displayed

### Split-View Layout
- **File:** `__tests__/components/split-view-layout.test.tsx`
- **Tests:** Layout rendering, resizing, component integration
- **Assertions:**
  - Layout renders with editor and chat components
  - Resizing works correctly
  - Editor and chat interface can communicate

### Model Selector
- **File:** `__tests__/components/model-selector.test.tsx`
- **Tests:** Selection, grouping, display options
- **Assertions:**
  - Models are rendered in dropdown
  - Selection works correctly
  - Provider grouping functions as expected
  - Cost tier information displays when enabled

## API Tests

### AI API Route
- **File:** `__tests__/api/ai.test.ts`
- **Tests:** API handling, error management, validation
- **Assertions:**
  - Requests are properly validated
  - API errors are handled gracefully
  - Responses are formatted correctly

## Expected outcomes

All tests should provide detailed pass/fail information in the test results that will be committed to this repository. The GitHub Actions workflow will run the tests and save the output to the `test-results` directory.