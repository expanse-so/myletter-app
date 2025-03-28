# MyLetter App

MyLetter is a minimalist newsletter platform with AI assistance for content creators who value simplicity.

## Features

- **AI Collaboration**: Chat with AI to craft your content while seeing the results in real-time
- **Minimalist Editor**: A clean, distraction-free editor that puts your content front and center
- **Simple Management**: Manage subscribers, schedule deliveries, and track performance with an intuitive dashboard

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/expanse-so/myletter-app.git
cd myletter-app
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

MyLetter App follows a test-driven development approach using Vitest and React Testing Library. Tests are automatically run in GitHub Actions when changes are pushed.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test-Driven Development Workflow

1. Write tests for a new feature before implementing the feature
2. Push tests to GitHub to see them fail (red)
3. Implement the feature according to test requirements
4. Push implementation to GitHub to see tests pass (green)
5. Refactor as needed while maintaining passing tests

### Accessing Test Results

Test results are available through:

1. GitHub Actions UI in the repository
2. Programmatically via the `/api/test-results` endpoint

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, shadcn/ui
- **Editor**: TipTap
- **AI**: OpenAI API
- **Email**: AWS SES
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Testing**: Vitest, React Testing Library

## Development Philosophy

MyLetter App is built using the Expanse software architecture philosophy, where:

1. Knowledge lives in the database
2. Code manifestations (like apps) live in the cloud
3. Development happens entirely in GitHub, not locally
4. AI-assisted development is integrated into the workflow

## License

This project is licensed under the MIT License - see the LICENSE file for details.