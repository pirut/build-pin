
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });
    return project;
  },
});

export const listProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { mainFloorPlan: args.storageId });
  },
});

export const getMainPlanUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const addPdfToLibrary = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pdfs", {
      projectId: args.projectId,
      storageId: args.storageId,
      fileName: args.fileName,
    });
  },
});

export const listPdfsInLibrary = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pdfs")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
  },
});

export const createPin = mutation({
  args: {
    projectId: v.id("projects"),
    x: v.number(),
    y: v.number(),
    associatedPdfId: v.id("pdfs"),
    associatedPdfFileName: v.string(),
    associatedPdfThumbnailUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pin = await ctx.db.insert("pins", {
      projectId: args.projectId,
      x: args.x,
      y: args.y,
      associatedPdfId: args.associatedPdfId,
      associatedPdfFileName: args.associatedPdfFileName,
      associatedPdfThumbnailUrl: args.associatedPdfThumbnailUrl,
    });
    return pin;
  },
});

export const listPins = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pins")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
  },
});

export const getPin = query({
  args: {
    pinId: v.id("pins"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.pinId);
  },
});

export const addPdfToPin = mutation({
  args: {
    pinId: v.id("pins"),
    pdfId: v.id("pdfs"),
    fileName: v.string(),
    thumbnailUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("subplans", {
      pinId: args.pinId,
      pdfId: args.pdfId,
      fileName: args.fileName,
      thumbnailUrl: args.thumbnailUrl,
    });
  },
});

export const listSubplansForPin = query({
  args: {
    pinId: v.id("pins"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subplans")
      .filter((q) => q.eq(q.field("pinId"), args.pinId))
      .collect();
  },
});

export const createTask = mutation({
  args: {
    pinId: v.id("pins"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      pinId: args.pinId,
      title: args.title,
      description: args.description,
      status: "Not Started", // Default status
    });
  },
});

export const listTasksForPin = query({
  args: {
    pinId: v.id("pins"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("pinId"), args.pinId))
      .collect();
  },
});
