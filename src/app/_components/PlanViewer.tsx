"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';

const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), { ssr: false });
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Pin from "./Pin";

interface PlanViewerProps {
  projectId: string;
  onSelectPin: (pinId: string | null) => void;
}

const PlanViewer: React.FC<PlanViewerProps> = ({ projectId, onSelectPin }) => {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const sendImage = useMutation(api.projects.sendImage);
  const createPin = useMutation(api.projects.createPin);
  const project = useQuery(api.projects.getProject, { projectId });
  const mainPlanUrl = useQuery(api.projects.getMainPlanUrl, project?.mainFloorPlan ? { storageId: project.mainFloorPlan } : "skip");
  const pins = useQuery(api.projects.listPins, projectId ? { projectId } : "skip");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    // Step 3: Save the storageId to the project
    await sendImage({ storageId, projectId });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    try {
      const { pdfId, fileName, thumbnailUrl } = JSON.parse(data);
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      await createPin({
        projectId,
        x,
        y,
        associatedPdfId: pdfId,
        associatedPdfFileName: fileName,
        associatedPdfThumbnailUrl: thumbnailUrl,
      });
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  const handlePinClick = (pinId: string) => {
    onSelectPin(pinId);
  };

  return (
    <div className="flex-grow bg-gray-200 flex items-center justify-center relative">
      <Card
        className="w-full h-full flex items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-0 text-center">
          {mainPlanUrl ? (
            <KonvaCanvas projectId={projectId} mainPlanUrl={mainPlanUrl} />
          ) : (
            <>
              <p className="text-gray-500 mb-2">Upload Main Floor Plan</p>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            </>
          )}
        </CardContent>
      </Card>
      {pins?.map((pin, index) => (
        <div
          key={pin._id}
          className="absolute"
          style={{ left: pin.x, top: pin.y }}
        >
          <Pin pinId={pin._id} number={index + 1} onClick={handlePinClick} />
        </div>
      ))}
    </div>
  );
};

export default PlanViewer;