# AI Integration for Test-Driven Development

This document describes how to integrate your AI assistant with MyLetter App's test-driven development workflow.

## Overview

MyLetter App uses GitHub Actions to run tests whenever code is pushed to the repository. Test results are available through the GitHub UI and programmatically through a REST API endpoint. This allows your AI assistant to:

1. Write tests for a new feature
2. Push the tests to GitHub
3. Wait for the tests to run (and fail)
4. Implement the feature based on test requirements
5. Push the implementation to GitHub
6. Verify the tests now pass
7. Continue with further development or refinement

## Test Results API

The `/api/test-results` endpoint provides access to the latest test run results from GitHub Actions.

### Request

```
GET /api/test-results
```

### Response

```json
{
  "id": "1234567890",
  "status": "completed",
  "conclusion": "success",
  "created_at": "2025-03-28T12:34:56Z",
  "updated_at": "2025-03-28T12:40:23Z",
  "html_url": "https://github.com/expanse-so/myletter-app/actions/runs/1234567890",
  "tests_passed": true,
  "branch": "main",
  "commit": {
    "id": "7fc12fdd6e226dd5bec6b8b6a923e7bc808c6c45",
    "message": "Add test for newsletter save component",
    "author": "expanse-so"
  }
}
```

## API Client Example

The following code snippet demonstrates how to implement a simple API client for fetching test results in TypeScript:

```typescript
/**
 * Simple client for fetching test results
 */
export async function fetchTestResults() {
  try {
    const response = await fetch('/api/test-results');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test results: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
}

/**
 * Poll for test results until a specific condition is met
 * @param pollInterval - Interval in milliseconds between polls
 * @param maxPolls - Maximum number of polls before giving up
 * @param condition - Function that determines when to stop polling
 */
export async function pollForTestResults(
  pollInterval = 5000,
  maxPolls = 12,
  condition = (result) => result.status === 'completed'
) {
  let polls = 0;
  
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        if (polls >= maxPolls) {
          reject(new Error('Maximum polling attempts reached'));
          return;
        }
        
        polls++;
        const results = await fetchTestResults();
        
        if (condition(results)) {
          resolve(results);
        } else {
          setTimeout(poll, pollInterval);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
}
```

## Workflow Integration with AI Assistant

Here's a simple workflow for integrating your AI assistant with the test-driven development process:

1. **Write tests**: Your AI assistant writes tests for a new feature based on your requirements
2. **Push tests**: Your AI assistant uses the GitHub API to push the tests to the repository
3. **Poll test results**: The AI assistant polls the `/api/test-results` endpoint to check if tests have run
4. **Analyze failures**: If tests fail (as expected for not-yet-implemented features), the AI analyzes the failures
5. **Implement feature**: The AI implements the feature based on test requirements
6. **Push implementation**: The AI pushes the implementation to the repository
7. **Verify success**: The AI polls again for test results to verify tests now pass
8. **Report to user**: The AI assistant reports the results and next steps

## Security Considerations

- The API endpoint requires authentication to prevent unauthorized access
- GitHub Actions has rate limits that may affect polling frequency
- Test results may include sensitive information that should be handled carefully