import { readFile, access, copyFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL(".", import.meta.url));
const orbitBuild = await build({
  absWorkingDir: root,
  entryPoints: ["src/dish-orbit-entry.jsx"],
  outdir: "dist/assets/dish-orbit",
  entryNames: "dish-orbit",
  assetNames: "[name]-[hash]",
  publicPath: "/assets/dish-orbit",
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2022"],
  loader: { ".webp": "file", ".woff2": "file" },
  legalComments: "external",
  define: { "process.env.NODE_ENV": '"production"' },
  metafile: true,
});
await copyFile(
  path.join(root, "src/vendor/dish-orbit/LICENSE"),
  path.join(root, "dist/assets/dish-orbit/COMPONENT-LICENSE.txt"),
);
for (const output of Object.keys(orbitBuild.metafile.outputs))
  await access(path.join(root, output));
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
  `Static build ready: ${files.size} entry assets, original dish carousel, local fonts, valid JavaScript and hosting manifest.`,
);
