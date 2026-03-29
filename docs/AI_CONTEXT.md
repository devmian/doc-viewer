# AI Context & Design System: Doc-Viewer

This document serves as a "Source of Truth" for any AI model interacting with the **Doc-Viewer** project. It outlines the visual language, coding style, and core architecture for long-term consistency.

## 1. Design Language: "Exaggerated Minimalism"

The project aims for an **industrial-grade, premium aesthetic**, characterized by:
- **Spacious Layouts**: Removal of narrow containers (`max-w-none` on major views) to maximize data clarity.
- **Glassmorphism**: Sticky headers with blur effects (`backdrop-filter: blur(8px)`).
- **Typography-First**: `Plus Jakarta Sans` as the primary font with heavy weights (`font-extrabold`) for headers.
- **Vector Iconography**: Use `lucide-react` exclusively. No emoji icons allowed in the core UI.
- **Color Palette**: Modern Slate/Blue. Use CSS variables from `src/index.css`.

## 2. Technical Stack

- **Framework**: React 19 / Vite.
- **Styling**: Tailwind CSS 4.
- **Navigation**: `wouter`.
- **Markdown**: `react-markdown` with syntax highlighting and copy-to-clipboard functionality.
- **Data Visualization**: `Highcharts` for statistics and `Sunburst` for directory distribution.

## 3. Core Component Reference

- **`Layout.tsx`**: The main application shell. Controls the sticky header, sidebar, and breadcrumb layout.
- **`Sidebar.tsx`**: Recursive tree-view for documenting hierarchical files.
- **`Dashboard.tsx`**: The entry page featuring data visualizations and quick links (Overview).
- **`DocPage.tsx`**: Dynamic page for browsing directories or viewing specific documents.
- **`Search.tsx`**: Real-time search component with modern UI.

## 4. Coding Standard

- **Functional Architecture**: Prefer functional components and custom hooks (`useDocs`, `useTheme`, `useI18n`).
- **Responsive-First**: All UI must scale elegantly from 375px to 2560px+.
- **Semantic HTML**: Use proper tags (`<header>`, `<main>`, `<article>`) for accessibility and content structure.

---
*Created during the UI Modernization Sprint, March 2026.*
