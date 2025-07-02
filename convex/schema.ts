
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
    status: v.string(), // This will eventually reference a status ID
  }),
  statuses: defineTable({
    name: v.string(),
    color: v.string(),
    type: v.union(v.literal("pin"), v.literal("task")),
  }),
  notes: defineTable({
    pinId: v.id("pins"),
    content: v.string(),
    category: v.string(), // e.g., "Issue", "Completed", "Question", "Approved"
  }),
  history: defineTable({
    entityId: v.union(v.id("projects"), v.id("pdfs"), v.id("pins"), v.id("subplans"), v.id("tasks"), v.id("statuses"), v.id("notes"), v.id("markups")),
    entityType: v.union(v.literal("pin"), v.literal("subplan"), v.literal("note"), v.literal("task")),
    action: v.string(), // e.g., "created", "updated", "deleted", "status_changed", "pdf_added"
    details: v.any(), // Store a JSON object with change details
  }),
  markups: defineTable({
    projectId: v.id("projects"),
    type: v.string(), // e.g., "line", "rectangle"
    data: v.any(), // Store Konva shape data
  }),
});
