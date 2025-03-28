# Artifacts-Only Test Trigger

This file triggers the artifacts-only-test.yml workflow, which runs tests and uploads the results as artifacts without trying to commit them back to the repository.

## Purpose
This simplified workflow solves potential permission issues by only using artifacts, which will be available in the GitHub Actions UI. This aligns with the Expanse architecture vision for automation by allowing the AI to download the artifacts when needed rather than requiring them to be committed back to the repository.

## Trigger Timestamp
2025-03-28T21:38:30Z

## Expected Outcome
- Test execution runs
- Results are uploaded as artifacts:
  - JSON output file 
  - Detailed text output
  - Summary report in Markdown
  - Basic summary text file

## Accessing Results
Test results will be available for download in the GitHub Actions UI under the "Artifacts" section of the workflow run. They are stored for 7 days by default.