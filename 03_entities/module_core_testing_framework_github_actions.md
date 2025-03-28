---
type: module_core
metadata:
  pipeline_id: myletter-app-testing-framework
  instance_id: myletter-app-20250328
  timestamp: 2025-03-28T19:15:00Z
  status: active
---

# Module: Core Testing Framework with GitHub Actions

## 1. Framework Overview

### Purpose
This module defines a comprehensive testing framework that integrates with GitHub Actions to automate test execution and reporting. It provides a consistent, reproducible approach to test-driven development that ensures code quality, maintains coverage standards, and generates accurate test results.

### Core Principles
1. **Test-First Development**: Tests are written before implementation code
2. **Actual Execution**: All tests are actually executed, not just claimed to pass
3. **Complete Coverage**: Testing covers all components, APIs, and integrations
4. **Continuous Verification**: Tests run automatically on PRs and can be triggered manually
5. **Transparent Reporting**: Real test results are committed to the repository

### Key Components
1. **Unit Testing**: Individual component and function testing
2. **Integration Testing**: Testing interactions between components 
3. **API Testing**: Testing API endpoints and responses
4. **Direct Testing**: Simple script-based tests for quick verification
5. **GitHub Actions**: Automation of test execution and reporting

## 2. Testing Implementation

### 2.1 Test Files Structure
```
myletter-app/
├── __tests__/
│   ├── components/
│   │   ├── model-selector.test.tsx
│   │   ├── tiptap-editor.test.tsx
│   │   ├── cursor-chat-interface.test.tsx
│   │   └── split-view-layout.test.tsx
│   ├── api/
│   │   └── ai.test.ts
│   ├── __mocks__/
│   │   └── next/
│   │       ├── router.js
│   │       └── server.js
│   └── README.md
├── run-direct-tests.js
├── jest.config.js
├── jest.setup.js
└── .github/
    └── workflows/
        ├── run-all-tests.yml
        ├── direct-test-result.yml
        └── test-files-check.yml
```

### 2.2 Test Types and Patterns

#### Unit Tests
- **Purpose**: Test individual components in isolation
- **Pattern**:
  ```typescript
  import { render, screen, fireEvent } from '@testing-library/react';
  
  describe('ComponentName', () => {
    test('specific behavior or functionality', () => {
      // Arrange
      render(<Component prop={value} />);
      
      // Act
      fireEvent.click(screen.getByText('Button Text'));
      
      // Assert
      expect(screen.getByText('Expected Result')).toBeInTheDocument();
    });
  });
  ```

#### Integration Tests
- **Purpose**: Test interactions between components
- **Pattern**:
  ```typescript
  describe('Component Integration', () => {
    test('components interact correctly', () => {
      // Arrange
      render(<ParentComponent />);
      
      // Act
      fireEvent.click(screen.getByText('Trigger Action'));
      
      // Assert
      expect(screen.getByTestId('child-component')).toHaveAttribute('data-state', 'updated');
    });
  });
  ```

#### API Tests
- **Purpose**: Test API endpoints and responses
- **Pattern**:
  ```typescript
  import { NextRequest } from 'next/server';
  import { POST } from '../app/api/route';
  
  describe('API Route', () => {
    test('handles valid request', async () => {
      // Arrange
      const request = new NextRequest({
        body: JSON.stringify({ key: 'value' })
      });
      
      // Act
      const response = await POST(request);
      
      // Assert
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(expect.objectContaining({
        success: true
      }));
    });
  });
  ```

#### Direct Tests
- **Purpose**: Simple, script-based tests for quick verification
- **Pattern**:
  ```javascript
  // In run-direct-tests.js
  describe('Feature', () => {
    test('basic functionality', () => {
      // Simplified test without requiring full React rendering
      expect(someFunction()).toBe(expectedResult);
    });
  });
  ```

### 2.3 Mocking Strategy

#### Component Dependencies
```typescript
// Mock external libraries
jest.mock('@tiptap/react', () => ({
  useEditor: () => ({
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: jest.fn() }),
      }),
    }),
    isActive: jest.fn().mockReturnValue(false),
  }),
  EditorContent: ({ editor }) => <div data-testid="editor-content">Content</div>,
}));
```

#### API Dependencies
```typescript
// Mock API calls
jest.mock('../../utils/api', () => ({
  sendMessageToAI: jest.fn().mockResolvedValue({
    text: 'Mock response',
    error: null
  }),
}));
```

#### Next.js Framework
```javascript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    push: jest.fn(),
  }),
}));
```

## 3. GitHub Actions Integration

### 3.1 Workflow Types

#### Complete Test Execution
- **File**: `.github/workflows/run-all-tests.yml`
- **Trigger**: Manual (workflow_dispatch)
- **Purpose**: Run all tests and generate comprehensive results
- **Steps**:
  1. Set up environment with all dependencies
  2. Create mock files and test configuration
  3. Execute all Jest tests (component and API)
  4. Run direct tests
  5. Compile and commit test results

#### Quick Verification
- **File**: `.github/workflows/direct-test-result.yml`
- **Trigger**: Comment (`/direct-test`)
- **Purpose**: Run simple tests for quick feedback
- **Steps**:
  1. Set up minimal environment
  2. Run direct test script
  3. Commit results

#### Test Structure Verification
- **File**: `.github/workflows/test-files-check.yml`
- **Trigger**: PR or manual
- **Purpose**: Verify all required test files exist
- **Steps**:
  1. Check existence of each test file
  2. Generate report on test file coverage

### 3.2 Result Reporting

#### Results File Structure
```
test-results/
├── real-test-output.md       # Complete test results 
├── jest-output.txt           # Raw Jest output
└── direct-test-output.txt    # Direct test script output
```

#### Results Format
```markdown
# ACTUAL TEST EXECUTION RESULTS

```
[Raw test output including passing/failing tests]
```

## Test Summary

* Total Tests: XX
* Passed: XX
* Failed: XX
```

## 4. Test-Driven Development Process

### 4.1 Complete TDD Workflow

1. **Test Planning**
   - Identify component/feature requirements
   - Define test cases covering all requirements
   - Document expected behavior

2. **Test Implementation**
   - Create test file in appropriate directory
   - Implement test cases with clear arrange/act/assert pattern
   - Ensure tests fail initially (RED)

3. **Code Implementation**
   - Implement minimal code to make tests pass
   - Run tests frequently to verify progress
   - Refactor code while maintaining passing tests (GREEN)

4. **Test Verification**
   - Trigger GitHub Actions workflow to run tests
   - Review actual test results
   - Ensure all tests pass and coverage meets standards

5. **Documentation**
   - Update test documentation
   - Document any edge cases or special considerations
   - Ensure test results are committed to the repository

### 4.2 GitHub Commands for Testing

| Command | Purpose |
|---------|---------|
| `/workflow-dispatch run-all-tests` | Run all tests and generate complete results |
| `/direct-test` | Run simple tests for quick feedback |
| `/workflow-dispatch test-files-check` | Verify all test files exist |

## 5. Testing Standards

### 5.1 Coverage Requirements

| Component Type | Line Coverage | Statement Coverage | Function Coverage | Branch Coverage |
|----------------|--------------|-------------------|-------------------|----------------|
| UI Components  | ≥90%        | ≥85%             | ≥90%             | ≥75%          |
| API Routes     | ≥85%        | ≥80%             | ≥90%             | ≥75%          |
| Utilities      | ≥90%        | ≥85%             | ≥95%             | ≥80%          |
| **Overall**    | ≥90%        | ≥85%             | ≥90%             | ≥75%          |

### 5.2 Test Quality Standards

1. **Isolation**: Tests should not depend on other tests
2. **Speed**: Tests should execute quickly
3. **Readability**: Tests should clearly show intent
4. **Maintainability**: Tests should be easy to update
5. **Determinism**: Tests should produce same results consistently

### 5.3 Test Documentation Standards

1. **Test Name**: Clear description of what is being tested
2. **Test Grouping**: Logical organization in describe blocks
3. **Test Assertions**: Clear expectations that validate specific requirements
4. **Test Comments**: Explanations for complex test scenarios

## 6. Implementation Guide

### 6.1 Setting Up the Testing Framework

1. Install dependencies:
   ```bash
   npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
   ```

2. Configure Jest:
   ```javascript
   // jest.config.js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['./jest.setup.js'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1',
     },
     testPathIgnorePatterns: ['<rootDir>/node_modules/'],
     transform: {
       '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
     },
   };
   ```

3. Set up Jest extensions:
   ```javascript
   // jest.setup.js
   import '@testing-library/jest-dom';
   ```

4. Create GitHub Action workflows:
   - `run-all-tests.yml` for complete test execution
   - `direct-test-result.yml` for quick tests
   - `test-files-check.yml` for test structure verification

### 6.2 Creating New Component Tests

1. Create test file in `__tests__/components/`:
   ```typescript
   // __tests__/components/new-component.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { NewComponent } from '../../components/new-component';
   
   describe('NewComponent', () => {
     test('renders correctly', () => {
       render(<NewComponent />);
       expect(screen.getByText('Component Text')).toBeInTheDocument();
     });
     
     // Add more tests...
   });
   ```

2. Implement mocks for dependencies
3. Run tests locally with `npm test`
4. Trigger GitHub workflow for complete testing

### 6.3 Creating New API Tests

1. Create test file in `__tests__/api/`:
   ```typescript
   // __tests__/api/new-route.test.ts
   import { NextRequest } from 'next/server';
   import { POST } from '../../app/api/new-route/route';
   
   describe('New API Route', () => {
     test('handles valid request', async () => {
       const request = new NextRequest({
         body: JSON.stringify({ key: 'value' })
       });
       
       const response = await POST(request);
       
       expect(response.status).toBe(200);
     });
     
     // Add more tests...
   });
   ```

2. Implement mocks for dependencies
3. Run tests locally with `npm test`
4. Trigger GitHub workflow for complete testing

## 7. Troubleshooting

### 7.1 Common Testing Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Tests pass locally but fail in CI | Environment differences | Ensure all dependencies and mocks are properly set up in CI |
| Flaky tests | Race conditions or timing issues | Add proper waiting mechanisms or async handling |
| Mocking failures | Incorrect mock setup | Verify mock paths and implementation |
| Memory issues | Test leaks or large test data | Clean up after tests and use appropriate-sized test data |
| Slow tests | Inefficient testing approach | Improve test isolation and use more targeted tests |

### 7.2 Workflow Debugging

1. **Check workflow logs** in GitHub Actions tab
2. **Examine test artifacts** generated by the workflow
3. **Compare local vs CI results** to identify environment issues
4. **Modify workflow** to add more debug information if needed
5. **Run specific tests** to isolate problems

## 8. Conclusion

This testing framework with GitHub Actions integration provides a robust, automated approach to ensure code quality through test-driven development. By following the patterns and processes defined in this module, you can maintain high test coverage, generate accurate test results, and build features with confidence that they meet requirements and maintain compatibility with existing code.

The key to success with this framework is consistency in application: always write tests first, always verify they pass through actual execution, and always document the results for transparency and future reference.

---

## Appendix: Test File Templates

### Component Test Template
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../../components/component-name';

// Mock dependencies as needed
jest.mock('dependency', () => ({
  useDependency: jest.fn().mockReturnValue({
    data: 'mock-data',
  }),
}));

describe('ComponentName', () => {
  // Test rendering
  test('renders correctly with default props', () => {
    render(<ComponentName />);
    expect(screen.getByTestId('component-id')).toBeInTheDocument();
  });
  
  // Test user interactions
  test('handles user interaction', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    fireEvent.click(screen.getByText('Action Button'));
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
  
  // Test specific conditions
  test('displays correct state when condition is true', () => {
    render(<ComponentName condition={true} />);
    expect(screen.getByText('Condition Met')).toBeInTheDocument();
  });
});
```

### API Test Template
```typescript
import { NextRequest } from 'next/server';
import { METHOD } from '../../app/api/route-name/route';

// Mock dependencies as needed
jest.mock('../../services/some-service', () => ({
  someFunction: jest.fn().mockResolvedValue('mock-result'),
}));

describe('API Route: route-name', () => {
  // Test valid requests
  test('handles valid request correctly', async () => {
    const request = new NextRequest({
      body: JSON.stringify({ param: 'value' }),
    });
    
    const response = await METHOD(request);
    
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        success: true,
      })
    );
  });
  
  // Test error handling
  test('handles invalid request appropriately', async () => {
    const request = new NextRequest({
      body: JSON.stringify({ /* invalid params */ }),
    });
    
    const response = await METHOD(request);
    
    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });
});
```