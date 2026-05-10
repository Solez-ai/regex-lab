# RegexLab

<p align="center">
  <img src="/regex-lab-logo.png" alt="RegexLab Logo" width="120" />
</p>

<p align="center">
  <strong>Professional Regex Testing Tool for Developers</strong>
</p>

---

## Overview

RegexLab is a fully client-side, browser-based Regular Expression testing and learning tool built for professional software developers. It provides a comprehensive environment for testing, validating, visualizing, and understanding regular expressions with real-time match highlighting, pattern explanation, and a suite of developer tools.

## Features

### Main Tester
- **Real-time Match Highlighting** - Visual feedback as you type with click-to-highlight functionality
- **Pattern Explainer** - Automatically breaks down and explains regex patterns in plain language
- **Capture Groups Display** - View all capture groups with named group support
- **Flag Controls** - Toggle global (g), case-insensitive (i), multiline (m), and dotall (s) flags
- **Performance Metrics** - View match count, evaluation time, and pattern length
- **Match Copying** - One-click copy of all matches or the pattern itself

### Tools Suite
1. **Pattern Generator** - Generate common regex patterns with customizable options (email, phone, URL, date, etc.)
2. **Regex Validator** - Validate regex syntax with detailed breakdown
3. **Pattern Diff** - Compare two patterns and visualize differences
4. **Pattern Visualizer** - View patterns as graph or tree structure
5. **Performance Test** - Benchmark regex against large text inputs
6. **Data Extractor** - Extract structured data using patterns

### Common Patterns Library
- Pre-built patterns for: Email, URL, Phone, IPv4, Date (ISO), Time (24h), Hex Color, UUID, HTML Tag, Credit Card, URL Slug, SemVer
- Click any pattern to instantly load it into the tester

### Saved Patterns
- Save custom patterns with labels and descriptions
- Persisted in localStorage for convenience
- Quick-load previously saved patterns

### Export Options
- Copy as plain text
- Export as code in multiple languages (JavaScript, Python, Go, Rust, Java, C#, PHP, Ruby)
- Export as JSON or plain text format

### Additional Features
- **Dark/Light Theme Toggle** - Switch between dark and light modes
- **Keyboard Shortcuts** - Ctrl+K (focus pattern), Ctrl+Enter (copy matches), Ctrl+Shift+C (clear)
- **Quick Reference Cheat Sheet** - Comprehensive regex syntax reference
- **Docs Page** - Documentation and learning resources

---

## Technology Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Animations**: Framer Motion 12.38.0
- **Fonts**: Geist (Sans & Mono)

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd regex
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
regex/
├── public/
│   ├── regex-lab-logo.png      # Application logo
│   ├── regex-lab-logo.ico      # Favicon
│   └── 204_1x_shots_so.png     # OG Image for social sharing
├── src/
│   ├── app/
│   │   ├── docs/               # Documentation page
│   │   ├── tools/              # Tools suite page
│   │   ├── globals.css         # Global styles and theme variables
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── page.tsx           # Main tester page
│   ├── components/
│   │   ├── layout/            # Layout components (TopBar, Sidebar)
│   │   ├── regex/             # Regex-specific components
│   │   ├── results/           # Results display components
│   │   ├── sidebar/           # Sidebar components
│   │   ├── testing/           # Testing-related components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and libraries
│   └── types/                 # TypeScript type definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Configuration

### Theme Customization

Theme colors are defined in `src/app/globals.css` using CSS custom properties. You can modify:

- `--color-bg-primary` / `--color-bg-secondary` / `--color-bg-tertiary`
- `--color-text-primary` / `--color-text-secondary` / `--color-text-muted`
- `--color-accent` (primary accent color - default: emerald green)
- `--color-accent-purple` (secondary accent color)
- `--color-match-a` / `--color-match-b` (match highlighting colors)

### Environment Variables

Create a `.env.local` file for any environment-specific configuration.

---

## Browser Support

RegexLab supports all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request or open an Issue for bugs, feature requests, or improvements.

---

## License

This project is private and proprietary. All rights reserved.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Fonts by [Geist](https://vercel.com/font)