# Testing Documentation

## Overview

This directory contains tests for the MyLetter application. We follow a test-first approach to ensure that all components and APIs are properly tested as they are developed.

## Test Structure

- `__tests__/components/` - Tests for React components
- `__tests__/api/` - Tests for API routes
- `__tests__/__mocks__/` - Mock implementations for testing

## Running Tests

### Locally

To run tests locally:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific tests
npm test -- tiptap-editor
```

### In CI

Tests are automatically run on pull requests and can be triggered manually with:

- `/test` - Runs the standard test workflow
- `/direct-test` - Runs tests and commits the results to the repository

## Test Results Verification

We have two ways to verify test results:

1. **GitHub Actions Workflow** - Results are shown in the PR comments
2. **Committed Test Results** - When using `/direct-test`, results are committed to the `test-results` directory

## FIO Mindset in Testing

We approach testing with a Figure-It-Out (FIO) mindset:

1. **Be proactive** - Don't assume tests will pass; verify they do
2. **Gather concrete data** - Capture and analyze actual test results
3. **Solve problems systematically** - When tests fail, investigate methodically
4. **Document everything** - Make sure test expectations and results are clear

## Coverage Goals

We aim for:
- Overall line coverage: ~85%
- Statement coverage: ~80%
- Function coverage: ~85%
- Branch coverage: ~70%