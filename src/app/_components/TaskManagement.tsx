import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TaskManagement = () => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Task management content will go here */}
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
