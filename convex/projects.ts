
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
    await ctx.db.insert("history", {
      entityId: project,
      entityType: "project",
      action: "created",
      details: { name: args.name, description: args.description },
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
    const pdf = await ctx.db.insert("pdfs", {
      projectId: args.projectId,
      storageId: args.storageId,
      fileName: args.fileName,
    });
    await ctx.db.insert("history", {
      entityId: pdf,
      entityType: "pdf",
      action: "added_to_library",
      details: { fileName: args.fileName, projectId: args.projectId },
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
    await ctx.db.insert("history", {
      entityId: pin,
      entityType: "pin",
      action: "created",
      details: { name: args.associatedPdfFileName, x: args.x, y: args.y },
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
    const subplan = await ctx.db.insert("subplans", {
      pinId: args.pinId,
      pdfId: args.pdfId,
      fileName: args.fileName,
      thumbnailUrl: args.thumbnailUrl,
    });
    await ctx.db.insert("history", {
      entityId: args.pinId,
      entityType: "subplan",
      action: "pdf_added",
      details: { subplanId: subplan, fileName: args.fileName },
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
    const taskId = await ctx.db.insert("tasks", {
      pinId: args.pinId,
      title: args.title,
      description: args.description,
      status: "Not Started", // Default status
    });
    await ctx.db.insert("history", {
      entityId: taskId,
      entityType: "task",
      action: "created",
      details: { title: args.title, description: args.description },
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

export const createStatus = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    type: v.union(v.literal("pin"), v.literal("task")),
  },
  handler: async (ctx, args) => {
    const status = await ctx.db.insert("statuses", {
      name: args.name,
      color: args.color,
      type: args.type,
    });
    return status;
  },
});

export const listStatuses = query({
  args: {
    type: v.optional(v.union(v.literal("pin"), v.literal("task"))),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("statuses")
        .filter((q) => q.eq(q.field("type"), args.type))
        .collect();
    } else {
      return await ctx.db.query("statuses").collect();
    }
  },
});

export const updatePinStatus = mutation({
  args: {
    pinId: v.id("pins"),
    statusId: v.id("statuses"),
  },
  handler: async (ctx, args) => {
    const oldPin = await ctx.db.get(args.pinId);
    await ctx.db.patch(args.pinId, { status: args.statusId });
    await ctx.db.insert("history", {
      entityId: args.pinId,
      entityType: "pin",
      action: "status_changed",
      details: { oldStatus: oldPin?.status, newStatus: args.statusId },
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    statusId: v.id("statuses"),
  },
  handler: async (ctx, args) => {
    const oldTask = await ctx.db.get(args.taskId);
    await ctx.db.patch(args.taskId, { status: args.statusId });
    await ctx.db.insert("history", {
      entityId: args.taskId,
      entityType: "task",
      action: "status_changed",
      details: { oldStatus: oldTask?.status, newStatus: args.statusId },
    });
  },
});

export const createNote = mutation({
  args: {
    pinId: v.id("pins"),
    content: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      pinId: args.pinId,
      content: args.content,
      category: args.category,
    });
    await ctx.db.insert("history", {
      entityId: noteId,
      entityType: "note",
      action: "created",
      details: { content: args.content, category: args.category },
    });
  },
});

export const listNotesForPin = query({
  args: {
    pinId: v.id("pins"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("pinId"), args.pinId))
      .collect();
  },
});

export const recordHistory = mutation({
  args: {
    entityId: v.id("pins"), // Can be pin, subplan, or note ID
    entityType: v.union(v.literal("pin"), v.literal("subplan"), v.literal("note"), v.literal("task")),
    action: v.string(), // e.g., "created", "updated", "deleted", "status_changed", "pdf_added"
    details: v.any(), // Store a JSON object with change details
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("history", {
      entityId: args.entityId,
      entityType: args.entityType,
      action: args.action,
      details: args.details,
    });
  },
});

export const listHistoryForEntity = query({
  args: {
    entityId: v.id("pins"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("history")
      .filter((q) => q.eq(q.field("entityId"), args.entityId))
      .order("desc")
      .collect();
  },
});
