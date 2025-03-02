# Screen Size Comparison Tool

A web application built with React, TypeScript, and Tailwind CSS that helps users compare different screen sizes visually and numerically.

## Features

- Compare multiple screen sizes simultaneously
- Input screen sizes in inches with aspect ratios
- Visual representation of size differences
- Calculate width, height, and area differences between screens
- Dark mode support
- Responsive design

## Tech Stack

- React 19
- TypeScript 5.7
- Vite 6.2
- Tailwind CSS 4.0
- React Router 7.2
- Lucide React (for icons)

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- pnpm (recommended)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd screen-size-comparison
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── pages/          # Page components
├── types.ts        # TypeScript interfaces
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```
