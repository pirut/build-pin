"use client";

import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from 'next/navigation';
import PdfLibrary from "../_components/PdfLibrary";
import PlanViewer from "../_components/PlanViewer";
import PinDetailPanel from "../_components/PinDetailPanel";


const ProjectWorkspace = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = useQuery(api.projects.getProject, { projectId });
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  if (!projectId || !project) {
    return <div>Loading project...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col text-black">
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <input type="text" placeholder="Search projects..." className="p-2 rounded text-black" />
        {/* Add project-specific actions here */}
      </header>
      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-gray-100 p-4 flex flex-col">
          <PdfLibrary projectId={projectId} />
          <div className="mt-4 flex-grow">
            <h2 className="text-lg font-bold mb-2">Pin List</h2>
            {/* Pin List content */}
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Task Summary</h2>
            {/* Task Summary content */}
          </div>
        </div>

        {/* Center Panel */}
        <PlanViewer projectId={projectId} onSelectPin={setSelectedPinId} />

        {/* Right Sidebar */}
        {selectedPinId && <PinDetailPanel pinId={selectedPinId} />}
      </div>
    </main>
  );
};

export default ProjectWorkspace;
