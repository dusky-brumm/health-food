import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
function run(command, args, cwd = root, extra = {}) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", ...extra });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command} failed`);
  return (result.stdout || "").trim();
}
const remote = run("git", ["remote", "get-url", "origin"]);
const match = remote.match(/github\.com[:/]([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
if (!match) throw new Error("origin must point to the intended GitHub repository.");
const [, owner, repository] = match;
const basePath = repository === `${owner}.github.io` ? "/" : `/${repository}/`;
run(process.execPath, ["build.mjs"], root, {
  env: { ...process.env, SITE_BASE_PATH: basePath }, stdio: "inherit",
});

// Keep source checkout and its branches intact; stage only dist in an isolated repository.
const stagePrefix = path.join(os.tmpdir(), "health-food-pages-");
const stage = await mkdtemp(stagePrefix);
async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name), to = path.join(destination, entry.name);
    if (entry.isDirectory()) await copyDirectory(from, to);
    else if (entry.isFile()) await copyFile(from, to);
  }
}
try {
  run("git", ["init", "-b", "gh-pages"], stage);
  run("git", ["remote", "add", "origin", remote], stage);
  const branch = run("git", ["ls-remote", "--heads", "origin", "gh-pages"], stage);
  if (branch) {
    run("git", ["fetch", "--depth=1", "origin", "gh-pages"], stage);
    run("git", ["update-ref", "refs/heads/gh-pages", "FETCH_HEAD"], stage);
    run("git", ["read-tree", "--empty"], stage);
  }
  await copyDirectory(path.join(root, "dist"), stage);
  run("git", ["config", "user.name", run("git", ["config", "user.name"])], stage);
  run("git", ["config", "user.email", run("git", ["config", "user.email"])], stage);
  run("git", ["add", "--all"], stage);
  const changes = run("git", ["status", "--porcelain"], stage);
  if (changes) {
    const source = run("git", ["rev-parse", "--short", "HEAD"]);
    run("git", ["commit", "-m", `Publish Health Food (${source})`], stage);
    run("git", ["push", "origin", "gh-pages"], stage, { stdio: "inherit" });
  }
  console.log(`Published branch: ${owner}/${repository}:gh-pages`);
  console.log(`Pages URL: https://${owner}.github.io${basePath}`);
  console.log("GitHub Pages must use gh-pages / (root) as its publishing source.");
} finally {
  // Remove only the exact, freshly created staging directory under the OS temp directory.
  const resolved = path.resolve(stage), expectedParent = path.resolve(os.tmpdir());
  if (path.dirname(resolved) !== expectedParent || !path.basename(resolved).startsWith("health-food-pages-"))
    throw new Error("Refusing to clean an unexpected staging path.");
  await rm(resolved, { recursive: true, force: true });
}
