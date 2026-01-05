<h1 align="center">
    iGrant.io Dataspace Portal
</h1>

<p align="center">
    <a href="/../../commits/" title="Last Commit"><img src="https://img.shields.io/github/last-commit/decentralised-dataexchange/data-space-portal?style=flat"></a>
    <a href="/../../issues" title="Open Issues"><img src="https://img.shields.io/github/issues/decentralised-dataexchange/data-space-portal?style=flat"></a>
    <a href="./LICENSE" title="License"><img src="https://img.shields.io/badge/License-Apache%202.0-yellowgreen?style=flat"></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#development">Development</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#licensing">Licensing</a>
</p>

## About

This repository hosts the source code for the reference implementation of the iGrant.io Dataspace Portal. The portal provides a user interface for managing data agreements, credentials, and B2B connections within the iGrant.io ecosystem.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 15.x | React framework with App Router |
| [React](https://react.dev/) | 19.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe JavaScript |
| [Material-UI](https://mui.com/) | 7.x | Component library |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.x | State management |
| [TanStack Query](https://tanstack.com/query) | 5.x | Server state management |
| [next-intl](https://next-intl-docs.vercel.app/) | 4.x | Internationalization (en, fi, sv) |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS |

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/decentralised-dataexchange/data-space-portal.git
   cd data-space-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables as needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/           # Internationalized routes
├── components/             # React components
│   ├── common/             # Shared/reusable components
│   └── ...                 # Feature-specific components
├── custom-hooks/           # Custom React hooks
├── lib/                    # API services and utilities
├── store/                  # Redux store and reducers
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── constants/              # Application constants
```

## Configuration

### API Base URL

The API base URL is configured in `src/constants/url.ts`:

```typescript
export const baseURL = "https://api.nxd.foundation";
// export const baseURL = "http://localhost:8000";
```

To use a different API endpoint:
1. Open `src/constants/url.ts`
2. Update the `baseURL` value to your API server address
3. Restart the development server

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

If you find any problems, please [create an issue](https://github.com/decentralised-dataexchange/data-space-portal/issues) in this repository.

## Licensing

Copyright (c) 2023-25 LCubed AB (iGrant.io), Sweden

Licensed under the Apache 2.0 License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License.
