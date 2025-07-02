
# Convex Documentation Summary

This document provides a summary of the Convex documentation, focusing on the features relevant to the construction project management application.

## Core Concepts

*   **Reactive Database:** Convex is a reactive database that automatically updates clients in real-time when data changes.
*   **Serverless Functions:** Logic is implemented as serverless functions that run on the Convex backend.
*   **Data Modeling:** Convex uses a document-oriented data model. Data is stored in tables as JSON-like documents.

## Key Features

### Database

*   **Documents:** Data is stored in documents, which are JSON-like objects with a unique `_id` and `_creationTime`.
*   **Tables:** Tables are created automatically when the first document is inserted.
*   **Schema:** Schemas are optional but can be used to enforce data consistency.
*   **Querying:** Queries are implemented as functions that are automatically re-run when data changes.
*   **Indexes:** Indexes can be used to optimize query performance.
*   **Relational Data:** Relationships between documents can be modeled using `Id` objects.

### Scheduling

*   **Scheduled Functions:** Functions can be scheduled to run at a specific time in the future.
*   **Cron Jobs:** Functions can be scheduled to run on a recurring basis.

### File Storage

*   **File Uploads:** Files can be uploaded from the client and stored in Convex.
*   **File Serving:** Files can be served to clients via a URL.
*   **Metadata:** File metadata can be accessed from Convex functions.

### Real-time

*   **Automatic Updates:** Clients are automatically updated in real-time when data changes.
*   **Caching:** Convex automatically caches query results on the client.
*   **Data Consistency:** Convex ensures that data is consistent across all clients.

### Vector Search

*   **Similarity Search:** Vector search can be used to find documents that are similar to a given vector.
*   **AI-powered Applications:** Vector search is useful for AI-powered applications, such as finding similar text, images, or audio.
*   **Vector Indexes:** Vector search requires a vector index to be defined in the schema.

