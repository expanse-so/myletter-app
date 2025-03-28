# Remote GitHub Testing Framework Module

## File Name

`module_core_testing_framework_github.md`

## Purpose
This Remote GitHub Testing Framework module provides a comprehensive approach for implementing test-driven development (TDD) workflows entirely within GitHub repositories without requiring local file access. Use this framework to ensure reliable, consistent testing when developing applications through AI-assisted workflows that operate directly on GitHub repositories.

## Requirements

### Essential Requirements
- **GitHub Personal Access Token (PAT)**: 
  - Required to programmatically interact with GitHub API
  - Needs permissions: `repo` (full repository access)
  - Usage: Triggering workflows, accessing files, committing changes

### Optional Requirements
- **Vercel Deployment**: If using the API endpoints approach
  - Vercel account
  - Project deployed to Vercel
  - Vercel CLI access token (for deployments)

### Technical Requirements
- **Testing Framework**: Vitest (or Jest)
- **React Testing Library**: For component testing
- **GitHub Actions**: For automated test execution
- **API Endpoint**: For accessing test results programmatically

## Key Frameworks

### 1. Remote TDD Approach
A test-driven development process executed entirely through GitHub without local file access.

1. **Write-Test-First Pattern**: Always begin with test files
   - Create test files in the GitHub repository
   - Define expected behavior before implementation
   - Use a clear naming convention: `*.test.tsx` or `*.test.ts`
   - Include explicit assertions about expected outcomes

2. **Test-Run Verification**: Confirm tests initially fail
   - Run tests via GitHub API or API endpoint
   - Verify tests fail appropriately (red phase)
   - Document failure points to guide implementation

3. **Implementation Cycle**: Create implementation files
   - Develop code based on test requirements
   - Commit directly to GitHub repository
   - Focus on the minimal implementation to make tests pass

4. **Test-Pass Confirmation**: Verify implementation works
   - Run tests again via the same mechanism
   - Confirm tests pass (green phase)
   - Identify any remaining issues requiring refinement

5. **Refactoring Phase**: Improve code without changing behavior
   - Optimize implementation while maintaining passing tests
   - Clean up code organization and structure
   - Run tests again to confirm refactoring didn't break functionality

### 2. Remote Testing Architecture
Components required to establish a GitHub-based testing system.

1. **Test Runner Integration**: 
   - GitHub Actions workflow for CI/CD
   - API endpoint for programmatic test execution
   - Test result storage and retrieval mechanism

2. **Result Access Layer**:
   - API endpoint to fetch test results
   - Client utility to parse and display results
   - Status reporting mechanism

3. **Simulated Results Fallback**:
   - JSON-based result simulation
   - Predictable failure/success patterns
   - Consistent format matching actual test output

## Testing Implementation Methods

### 1. GitHub Actions Workflow Method
Using GitHub's built-in CI/CD for test execution.

- **Advantages**:
  - Native GitHub integration
  - Full test environment control
  - Detailed logs and reporting
  
- **Implementation Steps**:
  ```yaml
  name: Run Tests
  
  on:
    workflow_dispatch:
    push:
      branches: [main]
    pull_request:
      branches: [main]
  
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm test
        - name: Generate Test Report
          run: npx vitest run --reporter json --outputFile=./test-results/results.json
        - name: Upload Test Results
          uses: actions/upload-artifact@v3
          with:
            name: test-results
            path: ./test-results
  ```

- **Result Retrieval**:
  ```bash
  curl -H "Accept: application/vnd.github+json" \
       -H "Authorization: Bearer $GITHUB_TOKEN" \
       "https://api.github.com/repos/OWNER/REPO/actions/runs/RUN_ID/artifacts"
  ```

### 2. API Endpoint Method
Custom API endpoints for test execution and result retrieval.

- **Advantages**:
  - Immediate access to results
  - No GitHub Actions workflow delay
  - Better integration with AI assistants
  
- **Implementation**:
  ```typescript
  // app/api/run-tests/route.ts
  import { NextResponse } from 'next/server';
  import { exec } from 'child_process';
  import { promisify } from 'util';
  import * as fs from 'fs';
  import * as path from 'path';

  const execPromise = promisify(exec);

  export async function GET() {
    try {
      // Run Vitest in non-watch mode
      const { stdout } = await execPromise('npx vitest run --reporter json');
      
      // Parse test results from JSON output
      const results = JSON.parse(stdout);
      
      return NextResponse.json(results);
    } catch (error) {
      console.error('Error running tests:', error);
      
      return NextResponse.json(
        { error: 'Failed to run tests' },
        { status: 500 }
      );
    }
  }
  ```

- **Client Utility**:
  ```typescript
  // lib/test-client.ts
  export async function fetchTestResults(): Promise<TestRunResult> {
    const response = await fetch('/api/run-tests');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test results: ${response.status}`);
    }
    
    return await response.json();
  }
  ```

### 3. Fallback Simulation Method
Using predetermined test results when actual execution isn't possible.

- **Advantages**:
  - Works without active deployment
  - Predictable results for development
  - No external dependencies
  
- **Implementation**:
  ```typescript
  // lib/simulated-test-results.json
  {
    "success": true,
    "numTotalTests": 7,
    "numPassedTests": 7,
    "numFailedTests": 0,
    "testResults": [
      {
        "name": "components/example.test.tsx",
        "status": "passed",
        "assertionResults": [
          {
            "title": "should render correctly",
            "status": "passed",
            "failureMessages": []
          }
        ]
      }
    ]
  }
  ```

## Practical Application

### Setting Up Remote TDD Infrastructure

Follow this sequence for establishing the remote TDD framework:

1. ☐ Create GitHub repository for your project
2. ☐ Set up basic Next.js project structure with TypeScript
3. ☐ Configure Vitest and React Testing Library
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
4. ☐ Create Vitest configuration file (vitest.config.ts)
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   import { resolve } from 'path';

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./test/setup.ts'],
       outputFile: {
         json: './test-results/results.json',
       },
     },
     resolve: {
       alias: {
         '@': resolve(__dirname, '.'),
       },
     },
   });
   ```
5. ☐ Create test setup file (test/setup.ts)
   ```typescript
   import '@testing-library/jest-dom';
   import { vi, beforeAll, afterAll } from 'vitest';

   // Setup mocks for various dependencies
   vi.mock('next/navigation', () => ({
     useRouter: () => ({
       push: vi.fn(),
       back: vi.fn(),
     }),
     useParams: () => ({}),
     usePathname: () => '/',
   }));

   // Global setup
   beforeAll(() => {
     // Setup globals
   });

   afterAll(() => {
     // Cleanup
   });
   ```
6. ☐ Set up GitHub Actions workflow (.github/workflows/test.yml)
7. ☐ Create API endpoint for running tests (app/api/run-tests/route.ts)
8. ☐ Implement client utility for fetching test results (lib/test-client.ts)
9. ☐ Add simulated test results for fallback (lib/simulated-test-results.json)

### Implementing Test-Driven Development Process

Follow this sequence for practicing TDD with the remote framework:

1. ☐ Define feature requirements clearly
2. ☐ Write test file for the feature
   ```typescript
   // example.test.tsx
   import { render, screen } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   import { Example } from './example';

   describe('Example Component', () => {
     it('should render the title', () => {
       render(<Example title="Test Title" />);
       expect(screen.getByText('Test Title')).toBeInTheDocument();
     });
   });
   ```
3. ☐ Commit test file to GitHub repository
4. ☐ Run tests to verify they fail (using API or GitHub Actions)
   ```bash
   curl -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
        "https://api.github.com/repos/OWNER/REPO/actions/workflows/test.yml/dispatches" \
        -d '{"ref":"main"}'
   ```
5. ☐ Review test failure details
6. ☐ Implement component based on test requirements
   ```typescript
   // example.tsx
   export function Example({ title }: { title: string }) {
     return <h1>{title}</h1>;
   }
   ```
7. ☐ Commit implementation to GitHub repository
8. ☐ Run tests again to verify they pass
9. ☐ Refactor if necessary, ensuring tests continue to pass

## Implementation Checklist

### Repository Setup
- [ ] GitHub repository created and initialized
- [ ] Personal Access Token (PAT) obtained with appropriate permissions
- [ ] Basic project structure established
- [ ] Testing dependencies installed
- [ ] Vitest configuration file created
- [ ] Test setup file created
- [ ] GitHub Actions workflow configured

### API and Utilities Setup
- [ ] API endpoint for running tests implemented
- [ ] Test result fetching utility created
- [ ] Simulated test results JSON file created
- [ ] Helper functions for parsing and displaying test results

### Test Process Implementation
- [ ] Test file naming convention established
- [ ] Test-first approach documented
- [ ] Component implementation guidelines established
- [ ] Test running mechanism verified
- [ ] Result interpretation process documented

## Implementation Guidelines

### Writing Effective Remote Tests

1. **Clear Test Descriptions**:
   - Use descriptive test names that identify exact functionality
   - Include expected behavior in test descriptions
   - Group related tests under descriptive `describe` blocks
   - Pattern: `it('should [expected behavior] when [condition]')`

2. **Comprehensive Test Coverage**:
   - Test component rendering
   - Test user interactions
   - Test error conditions
   - Test edge cases
   - Test asynchronous behavior

3. **Effective Mocking**:
   - Mock external dependencies
   - Use `vi.mock()` for dependency mocking
   - Create realistic test data
   - Isolate components for unit testing

4. **Self-Contained Tests**:
   - Each test should be independent
   - Reset state between tests
   - Avoid test interdependencies
   - Use `beforeEach` for common setup

### Result Interpretation and Display

1. **Success Indicators**:
   - ✅ Passing tests
   - ❌ Failing tests
   - 🟡 Skipped tests
   - 📊 Coverage metrics

2. **Failure Analysis**:
   - Examine assertion failures
   - Check exact vs. received values
   - Look for missing elements
   - Validate mock calls

3. **Results Display Formatting**:
   ```
   Test Run Results (2023-01-01T12:00:00Z)
   Status: PASSED ✅
   Tests: 7/7 passed

   File: components/example.test.tsx (passed)
     ✅ should render correctly
     ✅ should handle user interaction
   ```

## Error Prevention

1. **Common Test Writing Errors**:
   - Forgetting to import required testing utilities
   - Using incorrect assertions for the test case
   - Not properly setting up mocks
   - Missing key test cases

2. **Test Execution Errors**:
   - GitHub token expiration or permission issues
   - API endpoint deployment failures
   - Network connectivity problems
   - Repository access issues

3. **Test Result Interpretation Errors**:
   - Misreading failure messages
   - Ignoring critical test failures
   - Over-focusing on trivial issues
   - Missing important coverage gaps

## Related Modules
- Domain Web Application Development (Domain): For web application context
- GitHub Integration Framework (Core): For GitHub API interactions
- CI/CD Pipeline Management (Core): For workflow automation
- API Development Framework (Domain): For creating test result endpoints

## ⚠️ IMPORTANT WARNINGS ⚠️

- NEVER store GitHub Personal Access Tokens in code or commit them to repositories
- ALWAYS use environment variables or secure storage for tokens
- KEEP test files and implementation files in sync to maintain TDD integrity
- VERIFY token permissions carefully to avoid security issues
- DO NOT rely exclusively on simulated results for critical features

CRITICAL: Remember to use the File System MCP for ALL file operations.