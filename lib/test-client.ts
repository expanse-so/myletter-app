/**
 * Client-side utility for fetching test results from the API
 */

export interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage: string | null;
}

export interface TestFileResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  tests: TestResult[];
}

export interface TestRunResult {
  success: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  timestamp: string;
  testFiles: TestFileResult[];
}

/**
 * Fetch test results from the API
 */
export async function fetchTestResults(): Promise<TestRunResult> {
  try {
    const response = await fetch('/api/run-tests');
    
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
  condition = (result: TestRunResult) => true
): Promise<TestRunResult> {
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

/**
 * Format test results as a readable string
 */
export function formatTestResults(results: TestRunResult): string {
  let output = `Test Run: ${results.timestamp}\n`;
  output += `Status: ${results.success ? 'Passed ✅' : 'Failed ❌'}\n`;
  output += `Tests: ${results.passedTests}/${results.totalTests} passed\n\n`;
  
  results.testFiles.forEach(file => {
    output += `File: ${file.name} (${file.status})\n`;
    
    file.tests.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
      output += `  ${icon} ${test.title}\n`;
      
      if (test.errorMessage) {
        output += `    Error: ${test.errorMessage}\n`;
      }
    });
    
    output += '\n';
  });
  
  return output;
}