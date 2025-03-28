# MyLetter App Development Working Memory

## Project Overview
- **Project Name**: MyLetter
- **Domain**: myletter.ai
- **Description**: A minimalist newsletter platform with AI-assisted content creation
- **Inspired By**: Cursor IDE's AI collaboration model
- **Primary Goal**: Create a clean, simple interface for newsletter creation with AI assistance
- **Repository**: https://github.com/expanse-so/myletter-app

## Key Requirements
- Chat interface on the right
- Newsletter editor on the left using TipTap
- Custom blocks and TipTap extensions
- Writing style storage for AI reference
- Simple subscriber management
- Minimalist, clean design
- Multiple AI model support

## Technology Stack
- **Frontend**: Next.js with App Router
- **Styling**: TailwindCSS + shadcn/ui
- **Database/Auth**: Supabase
- **Editor**: TipTap
- **Email**: Amazon SES (replacing Resend)
- **AI Integration**: OpenAI API and Google Gemini with support for multiple models
- **Deployment**: Vercel
- **Testing**: Vitest with GitHub-based remote testing

## Current Status
- AI integration successfully implemented and working
- Split-view layout with TipTap editor and AI chat completed
- Dynamic model selection implemented with grouped options by provider
- Application successfully deployed to Vercel
- Core editor functions working correctly with formatting support
- Email generation functionality implemented and tested
- GitHub-based remote TDD approach established with vitest
- Bug fixes implemented for Vercel deployment issues
- Newsletter saving functionality completed
- Next focus: Subscriber management and authentication

## Recent Achievements
- Fixed Vitest configuration type errors by modifying the plugins array
- Updated tsconfig.json to exclude test files from production build
- Modified next.config.mjs to properly handle test files
- Successfully implemented and tested email generation system
- Fixed type error in email-generator for list item processing
- Added Tabs component from shadcn/ui to resolve build errors
- Fixed Supabase client import in newsletter-save component
- Successfully deployed application to Vercel with all tests passing
- Established GitHub-based remote testing framework for TDD approach
- Documented the testing approach in dedicated module

## MVPs Completed
- Split-view layout with resizable panels
- TipTap editor with essential extensions
- AI chat interface with model selection
- Content insertion from AI to editor
- Newsletter saving functionality
- Basic email generation and delivery system

## MVPs In Progress
- Subscriber management
- Authentication for users

## Design Vision
- Clean, minimalist interface
- Split view with editor on left, chat on right
- Focused on content creation with minimal distractions
- Simple navigation between newsletters and letters
- Easy access to subscriber management
- Clear visualization of newsletter statistics
- Intuitive AI collaboration experience

## Database Schema
- Users (profile, authentication)
- Newsletters (collections)
- Letters (individual newsletter editions)
- Subscribers (recipient information)
- Newsletter_Subscribers (subscription relationships)
- AI_Chat_Messages (conversation history)

## Implementation Approach
- GitHub-based code repository (all code files maintained in GitHub, not local)
- GitHub-based TDD framework for remote testing
- Lean, minimalist implementation
- Focus on core functionality first
- Progressive enhancement of features
- Regular testing and validation
- Clean, maintainable code structure
- Type safety with TypeScript throughout

## Core MVP Functionality
1. Create newsletters with AI assistance (COMPLETED)
2. Save newsletters for later editing (COMPLETED)
3. Send newsletters to subscribers (COMPLETED)
4. Subscribe to newsletters via landing page (NEXT FOCUS)
5. Basic user authentication (NEXT FOCUS)

## Technical Considerations
- TipTap editor has limitations in text manipulation - must use supported API methods
- Content insertion works best with HTML content that matches TipTap's format
- Environment variables must be configured in Vercel for production use
- AWS SES is set up for email delivery but needs API integration
- Prioritize simplicity over feature richness for initial MVP
- Remote testing approach provides flexibility for AI-assisted TDD
- Vercel deployment has 100 deployment limit on free tier (6000 on Pro tier)
- GitHub Actions can serve as CI/CD pipeline with test results reporting

## Project Timeline
- Development to be completed in a condensed timeframe
- Focus on delivering functional MVP quickly
- Iterative improvements based on user feedback
- Regular deployment to Vercel production environment

## Core Values
- Simplicity over complexity
- User experience over feature bloat
- Performance over unnecessary sophistication
- Clean code over quick hacks
- Intuitive design over complex interfaces
- Test-driven development for reliability

## Next Development Focus
- Build simple subscriber management system
- Add basic authentication for user accounts
- Ensure mobile responsiveness for all core views
- Enhance email templates with more styling options
- Add analytics for email open and click rates
- Implement user profile management

## Lessons Learned
- Vitest and Next.js can have type conflicts due to different versions of Vite
- Excluding test files from production builds prevents deployment issues
- GitHub-based TDD allows for effective testing without local file access
- shadcn/ui components require careful setup but provide excellent UI foundation
- TipTap editor requires specific methods for content manipulation
- Email generation needs to handle both HTML and plain text carefully
- Deployment issues often relate to type errors or missing dependencies
- Proper error handling in builds can save significant debugging time

## Reference Screenshots
- Cursor IDE-like interface with split view
- TipTap block editor capabilities
- Minimalist design examples
- Chat-based AI collaboration interfaces
- Newsletter management dashboards