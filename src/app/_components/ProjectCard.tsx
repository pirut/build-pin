import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  projectId: string;
  projectName: string;
  creationDate: string;
  lastModifiedDate: string;
  thumbnailUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectId, projectName, creationDate, lastModifiedDate, thumbnailUrl }) => {
  return (
    <Link href={`/${projectId}`}>
      <Card className="w-64 cursor-pointer">
        {thumbnailUrl && <img src={thumbnailUrl} alt={projectName} className="w-full h-32 object-cover rounded-t-lg" />}
        <CardHeader>
          <CardTitle>{projectName}</CardTitle>
          <CardDescription>Created: {creationDate}</CardDescription>
          <CardDescription>Modified: {lastModifiedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Additional content can go here if needed */}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
