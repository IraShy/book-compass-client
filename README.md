# Book Compass - Frontend

> **Work in Progress** - This project is currently under active development. Features are incomplete and may not function as expected. Please check back later for a stable release.

This is the frontend part of the Book Compass project (book discovery and review management), built with React, TypeScript, and Vite.

**Backend Repository:** https://github.com/IraShy/book-compass

## Table of Contents

- [Current Features](#current-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)

## Current Features

### Implemented

- **User Authentication**: Registration, login, logout
- **Responsive Header**: Mobile-friendly navigation
- **Book Search Modal**: Search books by title and author(s)
- **Book Detail Page**: Display book information
- **Protected Routes**: Profile page accessible only to authenticated users
- **Form Validation**: Real-time validation with error handling

### In Development

- Book recommendations system
- User reviews and ratings
- Reading lists management

## Tech Stack

- React 18 with TypeScript
- React Router
- Tailwind CSS
- Vite
- Axios

## Prerequisites

- Node.js (v18 or higher)
- npm
- [Backend server](https://github.com/IraShy/book-compass) running (see backend repository for setup)

## Local Development Setup

0. **Set up backend**

Make sure [backend repository](https://github.com/IraShy/book-compass) is set up and running

1. **Clone the repository**

   ```bash
   git clone git@github.com:IraShy/book-compass-client.git
   cd book-compass-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**

   ```bash
   cp .env_sample .env
   ```

   Update `.env` with your backend API URL:

   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

- `/src/components/` - Reusable UI components
- `/src/pages/` - Page-level components
- `/src/hooks/` - Custom React hooks
- `/src/contexts/` - React context providers
- `/src/styles/` - Global styles and Tailwind configuration
- `/src/utils/` - Utility functions and validation
- `/src/types.ts` - TypeScript type definitions
