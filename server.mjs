import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};
http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const requestPath = decodeURIComponent(url.pathname);
      const filePath = path.resolve(
        root,
        "." + (requestPath === "/" ? "/index.html" : requestPath),
      );
      if (!filePath.startsWith(root)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      if (!(await stat(filePath)).isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Content-Type":
          mime[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      createReadStream(filePath)
        .on("error", () => response.destroy())
        .pipe(response);
    } catch {
      response
        .writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        .end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Health Food preview: http://127.0.0.1:${port}`),
  );
