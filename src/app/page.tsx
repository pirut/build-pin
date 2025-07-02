"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewProjectModal from "./_components/NewProjectModal";
import PdfLibrary from "./_components/PdfLibrary";
import PlanViewer from "./_components/PlanViewer";
import PinDetailPanel from "./_components/PinDetailPanel";
import ProjectCard from "./_components/ProjectCard";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = useQuery(api.projects.listProjects);

  return (
    <main className="flex min-h-screen flex-col text-black">
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Build-Pin</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project._id}
            projectId={project._id}
            projectName={project.name}
            creationDate={new Date(project._creationTime).toLocaleDateString()}
            lastModifiedDate={new Date(project._creationTime).toLocaleDateString()}
          />
        ))}
      </div>
      {isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
