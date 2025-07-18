# Script Service Frontend

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/8acca466-cfdd-4b58-b5e1-3c1d7f3f6783" />

A beautiful Vue 3 application for creating and editing interactive stories.  It lets you organise games, scenes and scripts while communicating with a backend service to generate content.

## Features
- Manage your games with scenes and characters
- Dark theme preference saved in local storage
- Built with [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) for a fast developer experience
- Localisation support via **vue-i18n**
- Unit testing configured with **Vitest**
- In-app notifications for key events

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

Notifications about saved scripts, scenes and login events appear in the top
right corner of the screen. Each one includes a subtle progress bar showing how
long it will stay visible. Notifications display in a green theme and fade away
after a few seconds.

Enjoy building your scripts! :sparkles:
