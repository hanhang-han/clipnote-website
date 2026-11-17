// Allowlisted static deployment. Never delete the site root or overwrite update feeds.
import { spawnSync } from "node:child_process";
import { readdir, stat, mkdtemp, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { tmpdir, homedir } from "node:os";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const host = process.env.CLIPERX_SSH_HOST || "ubuntu@43.134.1.121";
const siteOwner = process.env.CLIPERX_SITE_OWNER || "www-data";
if (!/^[a-z_][a-z0-9_-]*$/.test(siteOwner))
  throw new Error("Invalid site owner");
const identity =
  process.env.CLIPERX_SSH_KEY || join(homedir(), ".ssh/id_tencent");
const sshOptions = [
  "-i",
  identity,
  "-o",
  "BatchMode=yes",
  "-o",
  "ConnectTimeout=10",
];
if (process.env.CLIPERX_SSH_CONTROL_PATH)
  sshOptions.push("-o", `ControlPath=${process.env.CLIPERX_SSH_CONTROL_PATH}`);
const pages = [
  "docs.html",
  "docs/index.html",
  "download.html",
  "download/index.html",
  "404.html",
  "en/index.html",
  "en/docs/index.html",
  "en/download/index.html",
  "robots.txt",
  "sitemap.xml",
  "blog/how-to-view-clipboard-history-mac.html",
  "blog/best-clipboard-manager-mac.html",
  "blog/clipboard-manager-one-time-purchase.html",
  "compare/paste.html",
  "compare/maccy.html",
  "compare/cleanclip.html",
  "index.html",
];
for (const route of ["workshop", "workshop/develop", "workshop/submit", "workshop/mine", "workshop/review", "workshop/authorize"]) {
  pages.splice(pages.length - 1, 0, `${route}.html`, `${route}/index.html`, `en/${route}/index.html`);
}
for (const route of ["account", "checkout", "admin"]) {
  pages.splice(pages.length - 1, 0, `${route}.html`, `${route}/index.html`);
}
pages.splice(pages.length - 1, 0, "en/account/index.html");
const assets = (await readdir(join(dist, "assets"))).map(
  (name) => `assets/${name}`,
);
const files = [
  ...assets,
  "images/memory-collection.jpg",
  "videos/hero-island.mp4",
  "videos/hero-poster.webp",
  ...pages,
];
for (const file of files) {
  if (
    !/^[a-zA-Z0-9_./-]+$/.test(file) ||
    file.split("/").some((part) => part.startsWith("."))
  )
    throw new Error(`Unsafe path: ${file}`);
  if (!(await stat(join(dist, file))).isFile())
    throw new Error(`Not a file: ${file}`);
}
if (process.argv.includes("--dry-run")) {
  console.log("Deploy allowlist:\n" + files.join("\n"));
  console.log(
    "Preserve: appcast.xml, installers, legal pages and unrelated blog/compare pages, old assets, other apps.",
  );
  process.exit(0);
}
const run = (bin, args, input) => {
  const result = spawnSync(bin, args, {
    stdio: input === undefined ? "inherit" : ["pipe", "inherit", "inherit"],
    input,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${bin} failed (${result.status})`);
};
const stamp =
  new Date().toISOString().replace(/[-:.TZ]/g, "") + `-${process.pid}`;
const remoteStage = `/tmp/cliperx-web-${stamp}`;
const temp = await mkdtemp(join(tmpdir(), "cliperx-web-"));
try {
  await writeFile(join(temp, "manifest.txt"), files.join("\n") + "\n");
  run("tar", ["-czf", join(temp, "payload.tar.gz"), "-C", dist, ...files]);
  run("ssh", [...sshOptions, host, `mkdir -m 700 '${remoteStage}'`]);
  run("scp", [
    ...sshOptions,
    join(temp, "payload.tar.gz"),
    join(temp, "manifest.txt"),
    `${host}:${remoteStage}/`,
  ]);
  // Input is literal shell source; only controlled timestamp/staging strings are substituted.
  run(
    "ssh",
    [...sshOptions, host, "bash -s"],
    `set -euo pipefail
site=/www/wwwroot/cliperx.com
stage='${remoteStage}'
backup=/var/backups/cliperx-web/${stamp}
sudo -n mkdir -p "$backup"
sudo -n tar -czf "$backup/site.tar.gz" -C "$site" .
sudo -n tar -tzf "$backup/site.tar.gz" >/dev/null
sudo -n cp "$stage/manifest.txt" "$backup/manifest.txt"
(cd "$site" && find . -type f \\( -name '*.dmg' -o -name 'appcast.xml' \\) -print0 | sort -z | xargs -0 sha256sum) > "$stage/protected-before.txt"
sudo -n cp "$stage/protected-before.txt" "$backup/protected-before.txt"
# Preserve live account/checkout routes absent from the historical Git source.
# Their original hashed assets remain in place. No checkout logic is modified.
for route in store checkout account; do
  if [ ! -f "$site/$route.html" ] && [ ! -f "$site/$route/index.html" ]; then
    if ! grep -q 'name="cliperx-design"' "$site/index.html"; then
      sudo -n install -o ${siteOwner} -g ${siteOwner} -m 644 "$site/index.html" "$site/$route.html"
    fi
  fi
done
mkdir "$stage/unpacked"
tar -xzf "$stage/payload.tar.gz" -C "$stage/unpacked"
# Assets first; index.html is last in the manifest. Rename each file atomically.
while IFS= read -r file; do
  sudo -n mkdir -p "$(dirname "$site/$file")"
  sudo -n install -o ${siteOwner} -g ${siteOwner} -m 644 "$stage/unpacked/$file" "$site/$file.new-${stamp}"
  sudo -n mv "$site/$file.new-${stamp}" "$site/$file"
done < "$stage/manifest.txt"
(cd "$site" && find . -type f \\( -name '*.dmg' -o -name 'appcast.xml' \\) -print0 | sort -z | xargs -0 sha256sum) > "$stage/protected-after.txt"
cmp "$stage/protected-before.txt" "$stage/protected-after.txt"
echo "DEPLOYED $site"
echo "BACKUP $backup/site.tar.gz"
echo "Protected update files verified unchanged."
`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
