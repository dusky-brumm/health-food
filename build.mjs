import { readFile, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const html = await readFile(path.join(root, "dist/index.html"), "utf8");
const js = await readFile(path.join(root, "dist/app.js"), "utf8");
const files = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "assets/fonts.css",
  ...[...html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)].map(
    (match) => match[1],
  ),
  ...[...js.matchAll(/photo:\s*["']([^"']+)["']/g)].map(
    (match) => "assets/" + match[1],
  ),
]);
for (const file of files) await access(path.join(root, "dist", file));
const fonts = await readFile(path.join(root, "dist/assets/fonts.css"), "utf8");
for (const font of fonts.matchAll(/url\((?:['"])?\.\/([^)'"\s]+)(?:['"])?\)/g))
  await access(path.join(root, "dist/assets", font[1]));
const check = spawnSync(
  process.execPath,
  ["--check", path.join(root, "dist/app.js")],
  { stdio: "inherit" },
);
if (check.status !== 0) process.exit(check.status || 1);
const manifest = JSON.parse(
  await readFile(path.join(root, ".openai/hosting.json"), "utf8"),
);
if (manifest.static?.directory !== "dist" || !manifest.project_id)
  throw new Error("Invalid hosting configuration");
console.log(
  `Static build ready: ${files.size} entry assets, local fonts, valid JavaScript and hosting manifest.`,
);
