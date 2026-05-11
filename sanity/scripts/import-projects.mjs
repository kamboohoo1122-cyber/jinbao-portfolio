import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {getCliClient} from "sanity/cli";

const studioDir = process.cwd();
const projectRoot = path.resolve(studioDir, "..");
const dataPath = path.join(projectRoot, "projects-data.js");
const source = fs.readFileSync(dataPath, "utf8");
const context = {window: {}};

vm.createContext(context);
vm.runInContext(source, context, {filename: dataPath});

const projects = context.window.PROJECTS || [];
const client = getCliClient({apiVersion: "2025-02-19"});
const uploadedAssets = new Map();

function toAbsoluteAssetPath(assetPath) {
  return path.resolve(projectRoot, assetPath.replace(/^\.\//, ""));
}

async function uploadImage(assetPath) {
  if (!assetPath) {
    return null;
  }

  const absolutePath = toAbsoluteAssetPath(assetPath);
  if (uploadedAssets.has(absolutePath)) {
    return uploadedAssets.get(absolutePath);
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image not found: ${absolutePath}`);
  }

  const asset = await client.assets.upload("image", fs.createReadStream(absolutePath), {
    filename: path.basename(absolutePath)
  });

  uploadedAssets.set(absolutePath, asset);
  return asset;
}

function imageField(asset, key) {
  return {
    _key: key,
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id
    }
  };
}

for (const [projectIndex, project] of projects.entries()) {
  const previewAsset = await uploadImage(project.preview || project.images?.[0]);
  const imageAssets = [];

  for (const [imageIndex, imagePath] of (project.images || []).entries()) {
    const asset = await uploadImage(imagePath);
    imageAssets.push(imageField(asset, `image-${imageIndex + 1}`));
  }

  const document = {
    _id: `project.${project.slug}`,
    _type: "project",
    title: project.title,
    slug: {
      _type: "slug",
      current: project.slug
    },
    category: project.category,
    year: project.year,
    sortOrder: (projectIndex + 1) * 10,
    description: project.description,
    tags: project.tags || [],
    challenge: project.challenge,
    role: project.role,
    process: project.process || [],
    outcome: project.outcome,
    preview: imageField(previewAsset, "preview"),
    images: imageAssets
  };

  await client.createOrReplace(document);
  console.log(`Imported ${project.title}`);
}

console.log(`Imported ${projects.length} projects.`);
