import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * API endpoint to run tests on demand and return results
 */
export async function GET() {
  try {
    // Run Vitest in non-watch mode
    const { stdout, stderr } = await execPromise('npx vitest run --reporter json');
    
    // Parse test results from JSON output
    const results = JSON.parse(stdout);
    
    // Format response
    const response = {
      success: results.success,
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      timestamp: new Date().toISOString(),
      testFiles: results.testResults.map((result: any) => ({
        name: result.name,
        status: result.status,
        duration: result.duration,
        tests: result.assertionResults.map((assertion: any) => ({
          title: assertion.title,
          status: assertion.status,
          duration: assertion.duration,
          errorMessage: assertion.failureMessages?.join('\n') || null
        }))
      }))
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error running tests:', error);
    
    // Try to parse the error output if possible
    let errorOutput = '';
    if (error instanceof Error) {
      errorOutput = error.message;
      
      // If it's an exec error, try to extract the stderr
      if ('stderr' in error && typeof error.stderr === 'string') {
        errorOutput = error.stderr;
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to run tests',
        details: errorOutput
      },
      { status: 500 }
    );
  }
}