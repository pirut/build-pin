import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const StatusSettings = () => {
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#000000');
  const [newStatusType, setNewStatusType] = useState<'pin' | 'task'>('pin');

  const createStatus = useMutation(api.projects.createStatus);
  const pinStatuses = useQuery(api.projects.listStatuses, { type: "pin" });
  const taskStatuses = useQuery(api.projects.listStatuses, { type: "task" });

  const handleCreateStatus = async () => {
    if (newStatusName && newStatusColor) {
      await createStatus({
        name: newStatusName,
        color: newStatusColor,
        type: newStatusType,
      });
      setNewStatusName('');
      setNewStatusColor('#000000');
    }
  };

  return (
    <Card className="w-96 bg-gray-100 p-4">
      <CardHeader>
        <CardTitle>Status Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-md font-bold mb-2">Create New Status:</h3>
          <Input
            placeholder="Status Name"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="color"
            value={newStatusColor}
            onChange={(e) => setNewStatusColor(e.target.value)}
            className="mb-2"
          />
          <select
            value={newStatusType}
            onChange={(e) => setNewStatusType(e.target.value as 'pin' | 'task')}
            className="mb-2 p-2 border rounded w-full"
          >
            <option value="pin">Pin Status</option>
            <option value="task">Task Status</option>
          </select>
          <Button onClick={handleCreateStatus}>Add Status</Button>
        </div>

        <h3 className="text-md font-bold mt-4 mb-2">Existing Pin Statuses:</h3>
        <div className="mb-4">
          {pinStatuses?.map((status) => (
            <div key={status._id} className="flex items-center mb-1">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: status.color }}></span>
              <span>{status.name}</span>
            </div>
          ))}
        </div>

        <h3 className="text-md font-bold mt-4 mb-2">Existing Task Statuses:</h3>
        <div>
          {taskStatuses?.map((status) => (
            <div key={status._id} className="flex items-center mb-1">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: status.color }}></span>
              <span>{status.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSettings;
