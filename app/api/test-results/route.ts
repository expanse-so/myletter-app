import { NextResponse } from 'next/server';

/**
 * API endpoint to retrieve the latest test results
 * This can be called by your AI assistant to get test outcomes without leaving your app
 */
export async function GET() {
  try {
    // GitHub API endpoint to fetch the latest workflow run for the test workflow
    const owner = 'expanse-so';
    const repo = 'myletter-app';
    const workflow_id = 'test.yml';
    
    // Fetch the latest workflow run
    const workflowResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${process.env.GITHUB_TOKEN || ''}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    
    if (!workflowResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch workflow runs' },
        { status: workflowResponse.status }
      );
    }
    
    const workflowData = await workflowResponse.json();
    
    if (!workflowData.workflow_runs || workflowData.workflow_runs.length === 0) {
      return NextResponse.json(
        { error: 'No test runs found' },
        { status: 404 }
      );
    }
    
    const latestRun = workflowData.workflow_runs[0];
    
    // Format the response
    const response = {
      id: latestRun.id,
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      created_at: latestRun.created_at,
      updated_at: latestRun.updated_at,
      html_url: latestRun.html_url,
      tests_passed: latestRun.conclusion === 'success',
      branch: latestRun.head_branch,
      commit: {
        id: latestRun.head_sha,
        message: latestRun.head_commit?.message || 'Unknown commit message',
        author: latestRun.head_commit?.author?.name || 'Unknown author',
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}