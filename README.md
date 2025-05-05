# Project Overview

This project is a web application built using the Next.js framework (App Router) with TypeScript. It features a dynamic content structure driven by JSON files and utilizes shadcn/ui for components and next-intl for internationalization.

## Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Key Concepts Explained](#key-concepts-explained)
  - [Dynamic Page Generation](#dynamic-page-generation)
  - [Component Organization](#component-organization)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [UI Components (shadcn/ui)](#ui-components-shadcnui)
  - [Blog Section](#blog-section)
- [Contributing](#contributing)
- [License](#license)

## Key Features

*   **Next.js App Router:** Leverages the latest Next.js features for routing, layouts, and server components.
*   **TypeScript:** Provides static typing for improved code quality and maintainability.
*   **Tailwind CSS & shadcn/ui:** Uses Tailwind CSS for utility-first styling and `shadcn/ui` for pre-built, accessible UI components.
*   **Dynamic Content:** Page structures and content are largely defined in JSON files within the `src/data` directory, particularly [`pageSections.json`](#dynamic-page-generation). Pages are rendered dynamically based on this data.
*   **Internationalization (i18n):** Supports multiple locales/languages using `next-intl`, with translations managed in the `messages` directory and locale-based routing (`/[locale]/...`).
*   **Static Generation:** Configured to generate static pages where possible (`generateStaticParams` used in product pages).
*   **ESLint:** Integrated for code linting.
*   **Blog Functionality:** Includes a blog section with index, individual post, and topic pages, potentially sourcing content from Notion.
*   **Pricing Page:** Dedicated page displaying pricing information loaded from `src/data/pricing.json`.
*   **Demo Page:** Dynamically generated demo request page using the structure defined in `src/data/pageSections.json`.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
*   **Package Manager:** npm

## Project Structure

```
.
├── messages/             # Raw translation files (e.g., sg.json, hk.json)
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, API routes)
│   │   ├── [locale]/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── products/[slug]/  # Dynamic product pages
│   │   │   ├── blog/             # Blog section
│   │   │   ├── pricing/          # Pricing page
│   │   │   ├── demo/             # Demo request page
│   │   │   └── ...             # Other static or dynamic pages
│   ├── components/       # Reusable React components
│   │   ├── common/         # Shared components (NavBar, Footer, Container, etc.)
│   │   ├── forms/          # Form-related components
│   │   ├── magicui/        # Custom UI elements/animations
│   │   ├── pages/          # Page structure components (e.g., DynamicSectionPage)
│   │   ├── sections/       # Components mapped in pageSections.json
│   │   └── ui/             # shadcn/ui components reside here
│   ├── data/             # JSON files driving content and structure (pageSections.json, etc.)
│   ├── i18n/             # Internationalization configuration (routing, request handling)
│   ├── lib/              # Utility functions and helpers (e.g., Notion client, metadata utils)
│   └── middleware.ts     # Next.js middleware (likely for i18n)
├── .env.example          # Example environment variables (if any)
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration (assumed location)
├── tsconfig.json         # TypeScript configuration
└── ... other config files
```

## Getting Started

### Prerequisites

*   Node.js (Version specified in `.nvmrc` or project requirements)
*   `npm` (usually comes with Node.js)

### Environment Variables

If the project uses environment variables (check for a `.env.example` or `.env.local` file), ensure you have the necessary variables set up. You might need to copy `.env.example` to `.env.local` and fill in the values.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  Install dependencies:
```bash
npm install
    ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the specified port) in your browser to see the application.

### Building for Production

```bash
npm run build
```

This command builds the application for production usage. You can then start the production server:

```bash
npm start
```

## Key Concepts Explained

### Dynamic Page Generation

This project employs two main patterns for page creation:

1.  **Fully Dynamic (JSON-driven):** Pages like individual products (`/products/[slug]`) and the demo page (`/demo`) have their structure and content defined entirely within **`src/data/pageSections.json`**. Specific page components (e.g., `src/app/[locale]/products/[slug]/page.tsx`) load this data and use a central **`DynamicSectionPage`** component (likely located in `src/components/pages/`) to render the sections defined in the JSON.

2.  **Hybrid (JSX Structure + JSON Data):** Pages like the Pricing page (`/pricing`) define their overall layout and structure within their JSX file (`src/app/[locale]/pricing/page.tsx`). However, they still load specific data elements (like pricing plan details) from dedicated JSON files (e.g., `src/data/pricing.json`).

**How to Modify Content:**

*   For **fully dynamic** pages (like `/demo`, `/products/...`): Edit the corresponding entry within **`src/data/pageSections.json`**. To add *new types* of sections, you'd also need to create the corresponding React component and potentially update the `DynamicSectionPage` component.
*   For **hybrid** pages (like `/pricing`): Modify the structure in the page's `.tsx` file (e.g., `src/app/[locale]/pricing/page.tsx`) and update the associated data in its specific JSON file (e.g., `src/data/pricing.json`).

### Component Organization

Components are organized within `src/components`:

*   **`src/components/common/`**: Contains highly reusable components used across many pages, such as `NavBar`, `Footer`, and layout containers.
*   **`src/components/ui/`**: Houses the base UI components installed from `shadcn/ui`. See the [UI Components (shadcn/ui)](#ui-components-shadcnui) section for more details.
*   **`src/components/sections/`**: This is a key directory containing the React components referenced by string name in `src/data/pageSections.json`. When the `DynamicSectionPage` renders a JSON-driven page, it maps the `component` names from the JSON to these actual components.
*   **`src/components/pages/`**: Holds components responsible for structuring entire page layouts, notably the `DynamicSectionPage` itself which assembles components based on `pageSections.json` data.
*   **`src/components/forms/`**: Contains components specifically designed for building and handling forms.
*   **`src/components/magicui/`**: Likely contains more complex, custom UI elements, potentially interactive or animated components.
*   **Root Level Components**: Some components like `LanguageSwitcher.tsx`, `theme-provider.tsx`, `UTMTracker.tsx`, etc., reside directly in `src/components` as they serve specific cross-cutting concerns.

### Internationalization (i18n)

*   **Locales:** Supported locales are defined in `src/i18n/routing.ts`.
*   **Routing:** Locales are part of the URL structure (e.g., `/en/products`, `/sg/about`). Middleware (`src/middleware.ts`) likely handles locale detection and routing.
*   **Translations:** Text strings are managed in `messages/*.json`. Keys used in the code are mapped to translated strings based on the current locale. The `i18next-parser.config.js` likely helps in extracting these keys.
*   **Configuration:** `next-intl` setup is configured in `src/i18n/request.ts`.

### UI Components (shadcn/ui)

*   Components are sourced from `shadcn/ui`. Installed components reside in `src/components/ui`.
*   Import components using the `@/components/ui` alias (e.g., `import { Button } from '@/components/ui/button'`).
*   To add new components, use the CLI: `npx shadcn@latest add <component-name>`.

### Blog Section

The application includes a blog located at `/blog`.

*   **Structure:** The blog uses a dedicated layout (`src/app/[locale]/blog/layout.tsx`) and includes:
    *   An index page (`src/app/[locale]/blog/page.tsx`) displaying featured and recent posts.
    *   Individual post pages using dynamic routing (`src/app/[locale]/blog/[slug]/page.tsx`).
    *   Topic pages (`src/app/[locale]/blog/topics/...`).
*   **Content Source:** Blog posts appear to be fetched from an external source, likely **Notion**, using helper functions like `getPublishedPosts` found in `src/lib/notion.ts`.
*   **Features:** The blog index page highlights featured posts and lists recent entries.

## Contributing

(Add contribution guidelines here if applicable)

## License

(Specify project license - e.g., MIT License based on the `LICENSE` file found)
