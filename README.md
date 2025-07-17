# Script Service Frontend

![Logo](assets/logo.png)

A beautiful Vue 3 application for creating and editing interactive stories.  It lets you organise games, scenes and scripts while communicating with a backend service to generate content.

## Features
- Manage your games with scenes and characters
- Dark theme preference saved in local storage
- Built with [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) for a fast developer experience
- Localisation support via **vue-i18n**
- Unit testing configured with **Vitest**

## Project Structure
```
src/
├── api            # API helpers
├── components     # Vue components
├── router         # Application routes
├── styles         # Global styles
├── store.js       # Reactive application state
└── main.js        # App entry point
```

## Development
Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
```

### Run unit tests

```bash
npm run test:unit
```

Enjoy building your scripts! :sparkles:
