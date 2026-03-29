# Doc-Viewer: Modern Documentation Explorer

A premium, localized documentation viewer built with React 19, Vite, and Tailwind CSS 4. This project features an "Exaggerated Minimalism" design system with deep support for hierarchical documentation browsing and data visualization.

---

## 🛠️ Development & Design Context

This project is optimized for both human developers and AI coding assistants. To ensure stylistic and technical consistency, please refer to:

- **AI Context**: [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) - Standard technical and design rules.
- **Visual Style**: [.cursor/rules/visual-style.mdc](.cursor/rules/visual-style.mdc) - Visual tokens and iconography rules.
- **Tech Stack**: [.cursor/rules/tech-stack.mdc](.cursor/rules/tech-stack.mdc) - Coding standards and architecture.

### Key Features
- **Modern UI**: Full-width layouts, Plus Jakarta Sans typography, and Glassmorphism headers.
- **Vector Icons**: Exclusively powered by `lucide-react`.
- **Data Insights**: Documentation distribution (Sunburst) and line count statistics (Highcharts).
- **Premium Reading**: Optimized prose layouts with syntax highlighting and code-copying.

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Data Structure

Place your Markdown files in the `docs` directory. The system automatically scans and generates a hierarchical navigation tree based on the folder structure.

---
© 2026 Doc-Viewer Modernization.
