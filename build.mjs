import { readFile, access, copyFile, writeFile, readdir, stat, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL(".", import.meta.url));
const rawBase = process.env.SITE_BASE_PATH || "/";
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(rawBase)) throw new Error("SITE_BASE_PATH must be an absolute path ending in /.");
await import("./src/render-pages.mjs");
await copyFile(path.join(root, "src/app.js"), path.join(root, "dist/app.js"));
await copyFile(path.join(root, "src/site.css"), path.join(root, "dist/site.css"));
await mkdir(path.join(root, "dist/assets/plates"), { recursive: true });
for (const name of ["salmon.webp", "ribeye.webp", "sea-bass.webp"]) {
  await copyFile(path.join(root, "src/vendor/dish-orbit/assets", name), path.join(root, "dist/assets/plates", name));
}
await copyFile(path.join(root, "src/vendor/dish-orbit/assets/dish-font.woff2"), path.join(root, "dist/assets/outfit-latin.woff2"));
await writeFile(path.join(root, "dist/site-meta.json"), JSON.stringify({ basePath: rawBase }));
await writeFile(path.join(root, "dist/.nojekyll"), "");
const orbitBuild = await build({
  absWorkingDir: root,
  entryPoints: ["src/dish-orbit-entry.jsx"],
  outdir: "dist/assets/dish-orbit",
  entryNames: "dish-orbit",
  assetNames: "[name]-[hash]",
  publicPath: `${rawBase}assets/dish-orbit`,
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
const js = await readFile(path.join(root, "dist/app.js"), "utf8");
const files = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "assets/fonts.css",
  "site.css",
  ...[...js.matchAll(/photo:\s*["']([^"']+)["']/g)].map(
    (match) => "assets/" + match[1],
  ),
]);
for (const file of files) await access(path.join(root, "dist", file));
const distRoot = path.join(root, "dist");
async function verifyPages(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { count += await verifyPages(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    count += 1;
    const html = await readFile(file, "utf8");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    if (new Set(ids).size !== ids.length) throw new Error(`Duplicate IDs: ${file}`);
    for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:)/.test(value)) continue;
      const [reference, hash] = value.split("#");
      const relative = reference.split("?")[0];
      let target = path.resolve(path.dirname(file), relative || ".");
      if (!relative) target = file;
      if (target !== distRoot && !target.startsWith(distRoot + path.sep)) throw new Error(`Link escapes dist: ${value}`);
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await access(target);
      if (hash && target.endsWith(".html")) {
        const targetHtml = target === file ? html : await readFile(target, "utf8");
        if (!targetHtml.includes(`id="${hash}"`)) throw new Error(`Missing fragment ${value} in ${file}`);
      }
    }
  }
  return count;
}
const pages = await verifyPages(distRoot);
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
  `Static build ready: ${pages} pages, verified internal links, original dish carousel, local fonts and valid JavaScript. Base: ${rawBase}`,
);
