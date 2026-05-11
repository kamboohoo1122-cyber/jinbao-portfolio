import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {visionTool} from "@sanity/vision";
import {schemaTypes} from "./schemaTypes/index.js";

export default defineConfig({
  name: "sister-portfolio",
  title: "何金宝作品集后台",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "fonl3jav",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
