"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchTestResults, TestRunResult } from '@/lib/test-client';

export function TestResultsViewer() {
  const [results, setResults] = useState<TestRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const testResults = await fetchTestResults();
      setResults(testResults);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch test results');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Test Results</h2>
        <Button 
          onClick={runTests} 
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${results.success ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              {results.success ? 'All Tests Passed' : 'Tests Failed'}
            </span>
          </div>
          
          <div className="flex space-x-4 text-sm">
            <div>
              <span className="font-medium">Total:</span> {results.totalTests}
            </div>
            <div>
              <span className="font-medium">Passed:</span> {results.passedTests}
            </div>
            <div>
              <span className="font-medium">Failed:</span> {results.failedTests}
            </div>
            <div>
              <span className="font-medium">Time:</span> {new Date(results.timestamp).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-3">
            {results.testFiles.map((file, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${file.status === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <h3 className="font-medium">{file.name.split('/').pop()}</h3>
                </div>
                
                <div className="space-y-2">
                  {file.tests.map((test, testIndex) => (
                    <div key={testIndex} className="pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          test.status === 'passed' ? 'bg-green-500' : 
                          test.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <p className="text-sm">{test.title}</p>
                      </div>
                      
                      {test.errorMessage && (
                        <div className="mt-1 pl-4 text-xs text-red-600 whitespace-pre-wrap">
                          {test.errorMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!results && !loading && !error && (
        <div className="text-center py-10 text-gray-500">
          Click "Run Tests" to see test results
        </div>
      )}
    </div>
  );
}