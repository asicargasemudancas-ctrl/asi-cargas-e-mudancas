import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");

const htmlFiles = [
  "index.html",
  "redes.html",
  "rotas.html",
  "orcamento.html",
  "mudanca-residencial.html",
  "mudanca-comercial.html",
  "mudanca-interestadual.html",
  "fretes-cargas.html",
  "embalagem-montagem.html",
];

const cssFiles = [
  "site.css",
  "detalhes.css",
  "bluemore.css",
  "modelo.css",
  "motion.css",
  "pages.css",
  "forms.css",
];

const jsFiles = [
  "analytics.js",
  "app.js",
  "motion.js",
  "reviews.js",
  "gsap-init.js",
];

const publicAssetExtensions = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    console.warn(`[build-dist] skip: ${relativePath}`);
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    console.warn(`[build-dist] skip: ${relativePath}`);
    return;
  }

  fs.cpSync(source, target, { recursive: true });
}

function copyPublicAssets(relativePath) {
  const source = path.join(root, relativePath);

  if (!fs.existsSync(source)) {
    console.warn(`[build-dist] skip: ${relativePath}`);
    return;
  }

  copyPublicAssetDirectory(source);
}

function copyPublicAssetDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const sourceFile = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      copyPublicAssetDirectory(sourceFile);
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (publicAssetExtensions.has(extension)) {
      copyFile(path.relative(root, sourceFile));
    }
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of htmlFiles) copyFile(file);
for (const file of cssFiles) copyFile(file);
for (const file of jsFiles) copyFile(file);

copyDirectory("data");
copyPublicAssets("assets");

for (const file of ["robots.txt", "sitemap.xml", "google73d03fb6322c1931.html"]) copyFile(file);

const files = fs.readdirSync(dist, { recursive: true, withFileTypes: true });
const fileCount = files.filter((entry) => entry.isFile()).length;

console.log(`[build-dist] pronto: ${fileCount} arquivos em ${dist}`);
