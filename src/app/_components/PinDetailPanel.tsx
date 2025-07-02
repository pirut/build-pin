"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PinDetailPanelProps {
  pinId: string | null;
}

const PinDetailPanel: React.FC<PinDetailPanelProps> = ({ pinId }) => {
  const pin = useQuery(api.projects.getPin, pinId ? { pinId } : "skip");
  const subplans = useQuery(api.projects.listSubplansForPin, pinId ? { pinId } : "skip");
  const tasks = useQuery(api.projects.listTasksForPin, pinId ? { pinId } : "skip");
  const notes = useQuery(api.projects.listNotesForPin, pinId ? { pinId } : "skip");
  const history = useQuery(api.projects.listHistoryForEntity, pinId ? { entityId: pinId } : "skip");
  const pinStatuses = useQuery(api.projects.listStatuses, { type: "pin" });
  const taskStatuses = useQuery(api.projects.listStatuses, { type: "task" });

  const addPdfToPin = useMutation(api.projects.addPdfToPin);
  const createTask = useMutation(api.projects.createTask);
  const updatePinStatus = useMutation(api.projects.updatePinStatus);
  const updateTaskStatus = useMutation(api.projects.updateTaskStatus);
  const createNote = useMutation(api.projects.createNote);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Issue'); // Default category

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!pinId) return;

    const data = event.dataTransfer.getData("text/plain");
    try {
      const { pdfId, fileName, thumbnailUrl } = JSON.parse(data);
      await addPdfToPin({
        pinId,
        pdfId,
        fileName,
        thumbnailUrl,
      });
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  const handleCreateTask = async () => {
    if (pinId && newTaskTitle) {
      await createTask({
        pinId,
        title: newTaskTitle,
        description: newTaskDescription,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleCreateNote = async () => {
    if (pinId && newNoteContent) {
      await createNote({
        pinId,
        content: newNoteContent,
        category: newNoteCategory,
      });
      setNewNoteContent('');
    }
  };

  const handlePinStatusChange = async (statusId: string) => {
    if (pinId) {
      await updatePinStatus({ pinId, statusId });
    }
  };

  const handleTaskStatusChange = async (taskId: string, statusId: string) => {
    await updateTaskStatus({ taskId, statusId });
  };

  if (!pinId || !pin) {
    return (
      <Card className="w-96 bg-gray-100 p-4">
        <CardHeader>
          <CardTitle>Pin Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Select a pin to view details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-96 bg-gray-100 p-4">
      <CardHeader>
        <CardTitle>Pin Details (Pin #{pin._id})</CardTitle>
      </CardHeader>
      <CardContent onDragOver={handleDragOver} onDrop={handleDrop}>
        <p>X: {pin.x}, Y: {pin.y}</p>
        <div className="mb-4">
          <h3 className="text-md font-bold">Pin Status:</h3>
          <Select onValueChange={handlePinStatusChange} value={pin.status || ""}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {pinStatuses?.map((status) => (
                <SelectItem key={status._id} value={status._id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h3 className="text-md font-bold mt-4">Associated Subplans:</h3>
        <div className="subplan-gallery mt-2">
          {subplans?.map((subplan) => (
            <div key={subplan._id} className="mb-2 p-2 border rounded bg-white">
              {subplan.thumbnailUrl && <img src={subplan.thumbnailUrl} alt="Subplan Thumbnail" className="w-full h-auto mb-2" />}
              <p className="text-sm font-medium">{subplan.fileName}</p>
            </div>
          ))}
          {subplans?.length === 0 && <p className="text-gray-500">Drag and drop PDFs here to add subplans.</p>}
        </div>

        <h3 className="text-md font-bold mt-4">Tasks:</h3>
        <div className="task-creation mt-2">
          <Input
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleCreateTask}>Add Task</Button>
        </div>
        <div className="task-list mt-4">
          {tasks?.map((task) => (
            <div key={task._id} className="mb-2 p-2 border rounded bg-white">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
              <Select onValueChange={(value) => handleTaskStatusChange(task._id, value)} value={task.status || ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses?.map((status) => (
                    <SelectItem key={status._id} value={status._id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {tasks?.length === 0 && <p className="text-gray-500">No tasks for this pin yet.</p>}
        </div>

        <h3 className="text-md font-bold mt-4">Notes:</h3>
        <div className="note-creation mt-2">
          <Textarea
            placeholder="Note Content"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="mb-2"
          />
          <Select onValueChange={setNewNoteCategory} value={newNoteCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Issue">Issue</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Question">Question</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNote} className="mt-2">Add Note</Button>
        </div>
        <div className="note-list mt-4">
          {notes?.map((note) => (
            <div key={note._id} className="mb-2 p-2 border rounded bg-white">
              <p className="font-medium">Category: {note.category}</p>
              <p className="text-sm text-gray-600">{note.content}</p>
            </div>
          ))}
          {notes?.length === 0 && <p className="text-gray-500">No notes for this pin yet.</p>}
        </div>

        <h3 className="text-md font-bold mt-4">History:</h3>
        <div className="history-list mt-2">
          {history?.map((entry) => (
            <div key={entry._id} className="mb-2 p-2 border rounded bg-white text-sm">
              <p className="font-medium">{new Date(entry._creationTime).toLocaleString()}</p>
              <p>Entity: {entry.entityType}, Action: {entry.action}</p>
              <pre className="text-xs text-gray-600">{JSON.stringify(entry.details, null, 2)}</pre>
            </div>
          ))}
          {history?.length === 0 && <p className="text-gray-500">No history for this pin yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PinDetailPanel;
