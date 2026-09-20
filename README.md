# Cyril Jacob — Portfolio

Personal portfolio: experience, featured ISRO super-resolution projects with results, writing, and a live in-browser object-detection demo (YOLOv8n running FP32 vs INT8 on ONNX Runtime Web).

Live at **https://cj445.github.io**

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) for the Inference Monitor

## Content

All copy lives in `src/data/portfolio.ts`; the section components only render it. Project images are in `public/images/projects/`.

## Run locally

```bash
git clone https://github.com/CJ445/cj445.github.io.git
cd cj445.github.io
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Inference Monitor

The demo runs entirely in the visitor's browser. The site is static (no backend): the page, two ONNX models (`public/models/`) and the WebAssembly runtime are downloaded once, and inference runs in a Web Worker on the visitor's device. Camera frames are never uploaded.

Model: Ultralytics YOLOv8n (AGPL-3.0), exported at 320×320. The INT8 variant is static QDQ quantization.

## Deployment

Pushes to `main` build with GitHub Actions and publish to GitHub Pages (`.github/workflows/deploy.yml`). In the repository settings, Pages → Build and deployment → Source must be **GitHub Actions**.
