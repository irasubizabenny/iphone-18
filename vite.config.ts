import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';

const FOLDER1_PATH = 'C:/Users/pc/Downloads/ezgif-7b8295686ba2c292-png-split';
const FOLDER2_PATH = 'C:/Users/pc/Downloads/ezgif-7a221e314e03f363-png-split';

function frameSequenceServerPlugin(): Plugin {
  return {
    name: 'frame-sequence-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // API to auto-detect and return frame sequence
        if (req.url === '/api/frames' || req.url === '/api/frames/') {
          try {
            const extractNum = (s: string) => {
              const m = s.match(/(\d+)/);
              return m ? parseInt(m[1], 10) : 0;
            };

            const f1 = fs.readdirSync(FOLDER1_PATH)
              .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
              .sort((a, b) => extractNum(a) - extractNum(b));

            const f2 = fs.readdirSync(FOLDER2_PATH)
              .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
              .sort((a, b) => extractNum(a) - extractNum(b));

            const frames = [
              ...f1.map((filename, i) => ({
                index: i,
                folder: 1,
                originalFilename: filename,
                url: `/frames/folder1/${filename}`
              })),
              ...f2.map((filename, i) => ({
                index: f1.length + i,
                folder: 2,
                originalFilename: filename,
                url: `/frames/folder2/${filename}`
              }))
            ];

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({
              totalFrames: frames.length,
              folder1Count: f1.length,
              folder2Count: f2.length,
              width: 2520,
              height: 1080,
              aspectRatio: 2.333333,
              frames
            }));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        // Direct streaming for folder 1 frames
        if (req.url.startsWith('/frames/folder1/')) {
          const filename = path.basename(req.url.split('?')[0]);
          const filePath = path.join(FOLDER1_PATH, filename);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }

        // Direct streaming for folder 2 frames
        if (req.url.startsWith('/frames/folder2/')) {
          const filename = path.basename(req.url.split('?')[0]);
          const filePath = path.join(FOLDER2_PATH, filename);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), frameSequenceServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      fs: {
        allow: [
          FOLDER1_PATH,
          FOLDER2_PATH,
          path.resolve(__dirname, '.'),
        ],
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
