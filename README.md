# Proton AI

A modern AI-powered web application built with Next.js, React, and TypeScript.

## Features

- 🤖 AI-powered chat functionality
- 🔐 User authentication (login/signup)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Fast performance with Next.js and Turbopack

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **AI Integration**: Google AI SDK
- **UI Components**: Radix UI
- **Development**: Turbopack for faster development

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd app
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── chat/        # Chat functionality
│   ├── login/       # Authentication
│   ├── signup/      # User registration
│   └── page.tsx     # Main page
├── components/      # Reusable UI components
├── lib/            # Utility functions and configurations
└── public/         # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

### Main Dependencies
- @ai-sdk/google - Google AI SDK integration
- @radix-ui/* - UI component primitives
- ai - AI utilities
- next - React framework
- react - UI library
- tailwind-merge - Utility for merging Tailwind classes

### Development Dependencies
- TypeScript
- ESLint
- Tailwind CSS
- Various type definitions

## License

Private - All rights reserved