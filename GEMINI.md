# Construction Project Management Software - MVP Specification

## Overview

A web-based construction project management application designed for companies that need to organize and manage construction drawings, specifically for windows and doors projects. The app allows users to upload floor plans, manage a library of PDF pages, and drag-and-drop specific pages to create subplan pins at precise locations on the main plan. Each pin maintains detailed notes, markup history, task management, and customizable status tracking for comprehensive project tracking.

## Core Features

### 1. Project Management

* **Create New Project**: Users see a prominent "New Project" button on the main dashboard. Clicking opens a modal with fields for project name, description, and optional project details. After clicking "Create", users are immediately taken to the empty project workspace.
* **Project Dashboard**: The landing page displays all projects in a card-based grid layout. Each project card shows the project name, creation date, last modified date, and a thumbnail of the main floor plan if uploaded. Users can search projects using a search bar at the top.
* **Project Selection**: Clicking any project card navigates to that project's workspace, which becomes the main working environment.

### 2. Main Plan Upload and Display

* **Plan Upload**: The project workspace initially shows a large dashed-border drop zone with "Upload Main Floor Plan" text and a cloud upload icon. Users can drag PDF, PNG, JPG, or DWG files directly onto this area, or click to open a file browser. A progress bar appears during upload.
* **Plan Viewer**: Once uploaded, the main plan displays in the center panel with intuitive zoom controls (+ and - buttons, zoom percentage display, and "Fit to Screen" button). Users can pan by clicking and dragging, and zoom with mouse wheel.
* **Plan Navigation**: Smooth animations accompany all zoom and pan operations. A mini-map in the corner shows the current view area when zoomed in.

### 3. PDF Library Management

* **Library Upload**: A dedicated "PDF Library" panel on the left sidebar contains a drop zone for uploading multi-page PDF documents. When a PDF is uploaded, the system automatically extracts each page as a separate thumbnail.
* **Page Thumbnails**: Each PDF page appears as a thumbnail in the library with the original filename and page number (e.g., "ShopDrawings.pdf - Page 3"). Thumbnails are sized for easy recognition but small enough to show many at once.
* **Library Organization**: Users can organize PDF pages into folders or categories within the library. A search function allows finding specific pages by filename or custom tags.
* **Drag and Drop Interface**: Users can drag any thumbnail from the PDF library directly onto the main floor plan. During dragging, the cursor changes to indicate a valid drop zone, and the main plan highlights potential drop areas.

### 4. Subplan Pinning System

* **Pin Creation via Drag-Drop**: When a user drags a PDF page from the library onto the main plan, releasing the mouse creates a new numbered pin at that exact location and automatically associates the PDF page as the first subplan.
* **Manual Pin Creation**: Users can also right-click anywhere on the main plan to create an empty pin, then add subplans later.
* **Pin Visualization**: Pins appear as circular numbered markers with a subtle drop shadow. Active or selected pins have a different color and slightly larger size. Pins display color-coded status indicators based on their current status.
* **Pin Management**: Clicking a pin selects it and shows a context menu with options to rename, move, or delete. Selected pins can be dragged to new positions.

### 5. Subplan Management

* **Subplan Association**: Each pin can have multiple PDF pages associated with it. Users can drag additional pages from the library onto existing pins to add more subplans.
* **Pin Detail Panel**: Clicking a pin opens a right sidebar showing all associated PDF pages as larger thumbnails, each with the original filename and page number clearly visible.
* **Subplan Viewer**: Clicking any subplan thumbnail opens it in a full-screen overlay viewer with its own zoom and pan controls, plus markup tools.
* **Subplan Organization**: Within each pin's detail panel, subplans can be reordered by dragging, and users can add custom names or descriptions to each subplan.

### 6. Task Management System

* **Task Creation**: Within each subplan, users can create tasks by clicking an "Add Task" button. A modal appears with fields for task title, description, due date, and assignee selection.
* **Task List View**: Each subplan displays an expandable task list showing all associated tasks with their current status, due dates, and assigned team members.
* **Task Assignment**: Users can assign tasks to team members from a dropdown list of project participants. Assigned users receive visual indicators next to their tasks.
* **Task Progress Tracking**: Tasks can be moved between different status columns using drag-and-drop functionality, similar to a Kanban board interface.
* **Task Details**: Clicking any task opens a detailed view showing full description, comments, attachments, and activity history.
* **Due Date Management**: Tasks with approaching or overdue dates are highlighted with color-coded indicators (yellow for approaching, red for overdue).

### 7. Customizable Status System

* **Status Configuration**: Project administrators can access a "Status Settings" panel where they can create, edit, and delete custom status options for both pins and tasks.
* **Default Statuses**: The system comes with pre-configured statuses like "Not Started", "In Progress", "Under Review", "Completed", and "On Hold", each with distinct colors.
* **Custom Status Creation**: Users can add new statuses by clicking "Add Status", entering a name, selecting a color, and choosing an icon from a predefined set.
* **Status Application**: Both pins and tasks can have their status changed through dropdown menus or drag-and-drop interfaces, with the selected status immediately reflected in the visual interface.
* **Status Filtering**: Users can filter the entire project view by status, showing only pins or tasks that match selected status criteria.
* **Status Workflows**: Advanced users can define status transition rules, determining which statuses can change to which other statuses.

### 8. Notes and Markup System

* **Drawing Tools**: A floating toolbar appears when viewing any plan (main or subplan) with tools for freehand drawing, highlighter, shapes (rectangle, circle, arrow), and text annotations. Each tool has color and size options.
* **Markup Layers**: All markups are stored on separate layers that can be toggled on/off. A layers panel shows different markup sessions with timestamps and author names.
* **Text Notes**: Users can click anywhere to add text notes, which appear as speech bubble icons. Clicking the icon shows the full note text in a popup.
* **Note Categories**: When adding notes, users select from predefined categories (Issue, Completed, Question, Approved) which are color-coded and filterable.

### 9. History and Version Control

* **Activity Timeline**: Each pin has a timeline view showing all changes chronologically - when subplans were added, markups created, notes added, tasks created or updated, and status changes. Each entry shows the timestamp and user who made the change.
* **Markup History**: Users can view previous versions of any drawing by selecting different dates from the timeline. Previous markups appear in a lighter opacity to distinguish from current markups.
* **Version Comparison**: A split-view mode allows comparing two different versions of the same drawing side-by-side.
* **Restore Functionality**: Users can select any previous version and click "Restore" to make it the current version, with the system saving the current version before restoring.

### 10. User Interface Layout

#### Main Workspace

* **Left Sidebar (300px)**: Contains the PDF Library at the top with thumbnail grid, Pin List in the middle showing all pins with their status indicators, and Task Summary at the bottom showing overdue and upcoming tasks across the project.
* **Center Panel (flexible)**: Displays the main floor plan with pins overlaid. Includes zoom controls in the bottom-right corner and a toolbar at the top for drawing tools and status filters.
* **Right Sidebar (350px)**: Appears when a pin is selected, showing pin details, associated subplans, task list, recent notes, and quick action buttons.

#### PDF Library Interface

* **Upload Area**: Prominent drop zone at the top of the left sidebar with "Upload PDF" button and drag-drop capability.
* **Thumbnail Grid**: Scrollable grid of PDF page thumbnails, each showing a preview image, filename, and page number.
* **Search and Filter**: Search bar above thumbnails with filter options for different PDF sources or custom tags.

#### Pin Detail Interface

* **Pin Header**: Shows pin name (editable), current status dropdown, location coordinates, and creation date.
* **Subplan Gallery**: Grid of associated PDF page thumbnails, each clickable to open in full viewer.
* **Task Management Section**: Expandable section showing all tasks associated with this pin's subplans, with options to add new tasks and change task statuses.
* **Notes Section**: Recent notes for this pin with expandable full note view.
* **Action Buttons**: "Add Subplan", "Add Task", "Add Note", "Change Status", "View History" buttons prominently displayed.

#### Task Management Interface

* **Task Cards**: Each task displays as a card showing title, description preview, due date, assignee avatar, and current status badge.
* **Status Columns**: When viewing tasks in board mode, tasks are organized into columns by status, allowing drag-and-drop status changes.
* **Task Filters**: Filter tasks by assignee, due date, status, or associated subplan with visual indicators showing active filters.
* **Quick Actions**: Hover over any task to reveal quick action buttons for editing, commenting, or changing status.

### 11. Search and Navigation

* **Global Search**: Search bar in the top navigation finds pins by name, associated PDF filenames, note content, task titles, or status.
* **Advanced Filter Controls**: Dropdown filters for pin status, task status, date ranges, assignees, and note categories with visual indicators showing active filters.
* **Quick Navigation**: Breadcrumb navigation showing current project > selected pin, with clickable elements to navigate back.
* **Status Dashboard**: Overview panel showing project progress with status distribution charts and task completion metrics.

### 12. Export and Sharing

* **Export Options**: Right-click context menu on any pin or plan offers export options (PDF with markups, PDF without markups, high-resolution image, task report).
* **Task Reports**: Generate comprehensive reports showing task status, completion rates, and overdue items with filtering options.
* **Batch Export**: Ability to select multiple pins and export all associated subplans and task summaries as a single PDF package.
* **Print Preview**: Dedicated print preview mode showing how drawings will appear on paper with options for scaling and orientation.

## User Workflows

### Primary Workflow: Project Setup with Task Management

1. User creates new project and configures custom statuses for their workflow
2. User uploads main floor plan and multi-page PDF documents to the library
3. User drags relevant PDF pages from library onto specific locations on the main plan, automatically creating pins
4. User creates tasks within each subplan, assigning team members and due dates
5. User sets initial statuses for pins and tasks based on current project state

### Daily Task Management Workflow

1. User opens project and sees main plan with status-coded pins and task summary
2. User reviews overdue and upcoming tasks in the left sidebar task summary
3. User clicks on specific pins to view associated tasks and update their status
4. User drags tasks between status columns to reflect current progress
5. User adds new tasks as work requirements are identified

### Status Tracking Workflow

1. User filters project view by specific statuses to focus on relevant work
2. User updates pin and task statuses as work progresses through drag-and-drop or dropdown selection
3. User reviews status dashboard to understand overall project progress
4. User generates status reports for stakeholder communication
5. User identifies bottlenecks by viewing tasks stuck in specific statuses

### PDF and Task Integration Workflow

1. User receives new shop drawings and uploads them to the PDF library
2. User drags relevant pages to appropriate pins and creates associated tasks
3. User assigns tasks to appropriate team members with due dates
4. User tracks task completion alongside drawing markup and notes
5. User exports comprehensive reports combining drawings, markups, and task status

## Technologies

### Backend and Authentication: Convex

Convex will be used as the backend for this project, providing a real-time database, serverless functions, and authentication.

*   **Real-time Database:** Convex's reactive database will be used to store and sync data between the clients and the server in real-time. This is ideal for a collaborative application like this, where changes need to be reflected instantly to all users.
*   **File Storage:** Convex's built-in file storage will be used to handle uploads of floor plans and PDF documents.
*   **Authentication:** Convex Auth will be used to manage user authentication, providing a simple and secure way for users to sign in to the application.
*   **Data Modeling:** Convex's data modeling capabilities will be used to define the schema for the application's data, including projects, pins, subplans, tasks, and users.

### PDF Processing and Rendering

* **PDF.js**: For rendering PDF files in the browser and extracting individual pages from multi-page documents. Handles PDF display, zoom, and page extraction for the library system.
* **PDF-lib**: For client-side PDF manipulation, page extraction, and creating new PDF documents from selected pages during export operations.

### CAD and Image Processing

* **DWG Viewer Library**: Commercial solution like AutoCAD Web API or CADViewer for handling DWG file display and basic manipulation.
* **Sharp or Canvas API**: For generating thumbnails from PDF pages and image files, ensuring fast loading of the PDF library interface.

### Drawing and Markup Tools

* **Fabric.js**: Comprehensive canvas library for implementing all drawing tools, markup functionality, and interactive elements. Handles freehand drawing, shapes, text annotations, and layer management.
* **Konva.js**: Alternative canvas library with excellent performance for handling large drawings and smooth zoom/pan operations.

### Task Management and UI Components

* **React Beautiful DND**: For implementing drag-and-drop functionality in task management, status changes, and Kanban-style interfaces.
* **Date Management Library**: For handling due dates, scheduling, and date-based filtering in task management features.

### File Handling and Storage

* **File Upload Libraries**: For handling drag-and-drop file uploads with progress indicators, file type validation, and chunked upload for large PDF files.
* **IndexedDB Wrapper**: For client-side storage of PDF pages, markups, project data, tasks, and custom status configurations. Libraries like Dexie.js provide a clean API over IndexedDB.

### Offline-Ready Architecture Components

* **Service Worker Libraries**: Workbox or similar for caching strategies, background sync, and offline functionality preparation.
* **Local Storage Management**: For storing project data, PDF library contents, task information, status configurations, and user preferences locally to enable seamless offline/online transitions.
* **Sync Queue System**: For managing changes made offline including task updates, status changes, and markup modifications, then synchronizing them when connectivity returns.

The architecture is designed with offline capability in mind, using client-side storage for all user data including task management and status tracking, implementing a sync-first approach where changes are stored locally and then synchronized with the server.