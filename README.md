VX Journey Intelligence Engine
A Vite + React application. The four-stage engine (Intake → Benchmark → Personas → Journey Maps) calls the Anthropic API through a serverless proxy so the API key is never exposed in the browser.
Local development
```bash
npm install
npm run dev
```
The app runs at `http://localhost:5173`.
> Note: the AI generation features call `/api/messages`, which is a Vercel serverless function. Locally you can run it with the Vercel CLI:
>
> ```bash
> npm i -g vercel
> vercel dev
> ```
>
> Plain `npm run dev` serves the UI, but the `/api/messages` route only runs under `vercel dev` or once deployed.
Build
```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```
Deploy to Vercel
Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
In Vercel, Import Project and select the repo. Vercel auto-detects Vite (build command `vite build`, output `dist`).
Under Settings → Environment Variables, add:
`ANTHROPIC_API_KEY` = your Anthropic API key (from https://console.anthropic.com)
Deploy.
The `api/messages.js` function reads `ANTHROPIC_API_KEY` server-side and forwards each request to `https://api.anthropic.com/v1/messages`. The front end calls the relative path `/api/messages`, so nothing sensitive ships to the browser.
Project structure
```
.
├── api/
│   └── messages.js          # serverless proxy to the Anthropic API
├── public/                  # (optional static assets)
├── src/
│   ├── App.jsx              # mounts the wizard
│   ├── VXJourneyWizard.jsx  # the full application component
│   ├── main.jsx             # React entry point
│   └── index.css            # global reset
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```trigger deploy
