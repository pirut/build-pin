
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    mainFloorPlan: v.optional(v.id("_storage")),
  }),
  pdfs: defineTable({
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    thumbnailUrl: v.optional(v.string()),
  }),
  pins: defineTable({
    projectId: v.id("projects"),
    x: v.number(),
    y: v.number(),
    associatedPdfId: v.id("pdfs"),
    associatedPdfFileName: v.string(),
    associatedPdfThumbnailUrl: v.optional(v.string()),
  }),
  subplans: defineTable({
    pinId: v.id("pins"),
    pdfId: v.id("pdfs"),
    fileName: v.string(),
    thumbnailUrl: v.optional(v.string()),
  }),
  tasks: defineTable({
    pinId: v.id("pins"),
    title: v.string(),
    description: v.string(),
    status: v.string(),
  }),
});
