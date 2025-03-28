# MyLetter App

A modern newsletter platform for creators with AI assistance.

## Features

- TipTap rich text editor for newsletter creation
- AI chat interface for content generation and improvement
- Split-view layout for easy collaboration with AI
- Model selection for different AI capabilities
- Newsletter saving and management
- Email delivery system
- Subscriber management

## Technology Stack

- Next.js 14 with App Router
- React 18
- TypeScript
- TailwindCSS
- Supabase for authentication and database
- TipTap for rich text editing
- OpenAI and Anthropic for AI models

## Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/expanse-so/myletter-app.git

# Navigate to the project directory
cd myletter-app

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

The project uses Jest and React Testing Library for testing.

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run tests in watch mode
npm run test:watch
# or
yarn test:watch

# Generate test coverage report
npm run test:coverage
# or
yarn test:coverage
```

### Test Structure

Tests are organized in the `__tests__` directory, mirroring the structure of the source code:

- `__tests__/components/` - Component unit tests
- `__tests__/api/` - API endpoint tests
- `__tests__/integration/` - Integration tests

## Deployment

The application is deployed on Vercel. Push to the `main` branch to trigger a production deployment.

## Contributing

1. Create a feature branch from `develop`
2. Implement changes with tests
3. Create a pull request to merge back to `develop`
4. After review and approval, changes will be merged to `main` for production

## License

All rights reserved © MyLetter App