import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const metaPath = path.join(root, "projects-meta.json");
const outputPath = path.join(root, "projects-data.js");
const projectInfoFileNames = ["项目说明.txt", "project.txt"];
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isImage(fileName) {
  return imageExtensions.has(path.extname(fileName).toLowerCase());
}

function isCover(fileName) {
  return /^cover\./i.test(fileName);
}

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

function hasChildDirs(dirPath) {
  return listDirs(dirPath).length > 0;
}

function listImages(dirPath, filter = () => true) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImage(entry.name) && filter(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
}

function readProjectInfo(slug) {
  const dirs = [
    path.join(root, "assets", "projects", slug),
    path.join(root, "assets", "images", slug)
  ];

  const infoPath = dirs
    .flatMap((dir) => projectInfoFileNames.map((fileName) => path.join(dir, fileName)))
    .find((filePath) => fs.existsSync(filePath));

  if (!infoPath) {
    return {};
  }

  return parseProjectInfo(fs.readFileSync(infoPath, "utf8"));
}

function parseProjectInfo(source) {
  const fields = {};
  let currentList = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    if (currentList && /^[-*]\s+/.test(line)) {
      fields[currentList].push(line.replace(/^[-*]\s+/, "").trim());
      continue;
    }

    const match = line.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (!match) {
      currentList = null;
      continue;
    }

    const key = match[1].trim();
    const value = match[2].trim();
    const fieldName = {
      "标题": "title",
      "title": "title",
      "分类": "category",
      "category": "category",
      "年份": "year",
      "year": "year",
      "排序": "order",
      "order": "order",
      "简介": "description",
      "首页简介": "description",
      "description": "description",
      "标签": "tags",
      "tags": "tags",
      "项目背景": "challenge",
      "背景": "challenge",
      "challenge": "challenge",
      "我的角色": "role",
      "角色": "role",
      "role": "role",
      "过程": "process",
      "过程拆解": "process",
      "process": "process",
      "结果": "outcome",
      "结果与复盘": "outcome",
      "outcome": "outcome"
    }[key];

    currentList = null;

    if (!fieldName) {
      continue;
    }

    if (fieldName === "tags") {
      fields.tags = value
        .split(/[,，、]/)
        .map((tag) => tag.trim())
        .filter(Boolean);
      continue;
    }

    if (fieldName === "process") {
      fields.process = value ? [value] : [];
      currentList = "process";
      continue;
    }

    if (fieldName === "order") {
      const order = Number(value);
      if (Number.isFinite(order)) {
        fields.order = order;
      }
      continue;
    }

    fields[fieldName] = value;
  }

  return fields;
}

function toWebPath(filePath) {
  return `./${path.relative(root, filePath).split(path.sep).join("/")}`;
}

function humanizeSlug(slug) {
  const withoutNumberPrefix = slug.replace(/^\d+[-_ ]*/, "");

  return withoutNumberPrefix
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function projectPaths(slug) {
  const oneFolderDir = path.join(root, "assets", "projects", slug);
  const legacyCoverDir = path.join(root, "assets", "covers", slug);
  const legacyImageDir = path.join(root, "assets", "images", slug);

  const oneFolderCovers = listImages(oneFolderDir, isCover).map((file) => path.join(oneFolderDir, file));
  const oneFolderImages = listImages(oneFolderDir, (file) => !isCover(file)).map((file) =>
    path.join(oneFolderDir, file)
  );
  const sameFolderCovers = listImages(legacyImageDir, isCover).map((file) => path.join(legacyImageDir, file));
  const sameFolderImages = listImages(legacyImageDir, (file) => !isCover(file)).map((file) =>
    path.join(legacyImageDir, file)
  );
  const legacyCovers = listImages(legacyCoverDir).map((file) => path.join(legacyCoverDir, file));

  const images = oneFolderImages.length > 0 ? oneFolderImages : sameFolderImages;
  const preview = oneFolderCovers[0] || sameFolderCovers[0] || legacyCovers[0] || images[0] || "";

  return {
    preview: preview ? toWebPath(preview) : "",
    images: images.map(toWebPath)
  };
}

function fallbackProject(slug, imageCount) {
  return {
    title: humanizeSlug(slug),
    category: "作品",
    year: String(new Date().getFullYear()),
    description: `自动读取 ${imageCount} 张作品图片。`,
    tags: [],
    challenge: "这个项目由图片文件夹自动生成，可在 projects-meta.json 中补充项目背景。",
    role: "可在 projects-meta.json 中补充职责说明。",
    process: [],
    outcome: "可在 projects-meta.json 中补充结果与复盘。"
  };
}

const meta = readJson(metaPath);
const slugs = new Set([
  ...Object.keys(meta),
  ...listDirs(path.join(root, "assets", "projects")),
  ...listDirs(path.join(root, "assets", "images"))
]);

const projects = [...slugs]
  .map((slug) => {
    const paths = projectPaths(slug);
    if (paths.images.length === 0) {
      if (!hasChildDirs(path.join(root, "assets", "images", slug))) {
        console.warn(`Skip ${slug}: no gallery images found.`);
      }
      return null;
    }

    return {
      slug,
      ...fallbackProject(slug, paths.images.length),
      ...meta[slug],
      ...readProjectInfo(slug),
      preview: paths.preview,
      images: paths.images
    };
  })
  .filter(Boolean)
  .sort((a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 9999;
    const orderB = Number.isFinite(b.order) ? b.order : 9999;
    return orderA - orderB || a.title.localeCompare(b.title, "zh-CN", { numeric: true });
  })
  .map(({ order, ...project }) => project);

const output = `window.PROJECTS = ${JSON.stringify(projects, null, 2)};\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Generated ${path.relative(root, outputPath)} with ${projects.length} projects.`);
