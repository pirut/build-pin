"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PinDetailPanelProps {
  pinId: string | null;
}

const PinDetailPanel: React.FC<PinDetailPanelProps> = ({ pinId }) => {
  const pin = useQuery(api.projects.getPin, pinId ? { pinId } : "skip");
  const subplans = useQuery(api.projects.listSubplansForPin, pinId ? { pinId } : "skip");
  const tasks = useQuery(api.projects.listTasksForPin, pinId ? { pinId } : "skip");
  const addPdfToPin = useMutation(api.projects.addPdfToPin);
  const createTask = useMutation(api.projects.createTask);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

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
            </div>
          ))}
          {tasks?.length === 0 && <p className="text-gray-500">No tasks for this pin yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PinDetailPanel;
