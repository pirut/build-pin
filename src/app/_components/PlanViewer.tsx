"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Document, Page } from 'react-pdf';

const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), { ssr: false });
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Pin from "./Pin";

interface PlanViewerProps {
  project: any;
  onSelectPin: (pinId: string | null) => void;
}

const PlanViewer: React.FC<PlanViewerProps> = ({ project, onSelectPin }) => {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const sendImage = useMutation(api.projects.sendImage);
  const createPin = useMutation(api.projects.createPin);
  const mainPlanUrl = useQuery(api.projects.getMainPlanUrl, project?.mainFloorPlan ? { storageId: project.mainFloorPlan } : "skip");
  const pins = useQuery(api.projects.listPins, project?._id ? { projectId: project._id } : "skip");

  
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfScale, setPdfScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });

  const onDocumentLoadSuccess = async (pdf: any) => {
    if (pdfFile && containerRef.current) {
      const page = await pdf.getPage(1);

      const { offsetWidth, offsetHeight } = containerRef.current;
      const scaleX = offsetWidth / page.view[2]; // page.view[2] is width
      const scaleY = offsetHeight / page.view[3]; // page.view[3] is height

      setPdfScale(Math.min(scaleX, scaleY));
      setContainerDims({ width: page.view[2] * Math.min(scaleX, scaleY), height: page.view[3] * Math.min(scaleX, scaleY) });
    }
  };

  

  

  useEffect(() => {
    let objectUrl: string | null = null;
    if (mainPlanUrl) {
      console.log(`Fetching main plan from: ${mainPlanUrl}`);
      const fetchPdf = async () => {
        try {
          const response = await fetch(mainPlanUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch main plan: ${response.statusText}`);
          }
          const blob = await response.blob();
          console.log(`Successfully fetched blob for main plan, size: ${blob.size}`);
          objectUrl = URL.createObjectURL(blob);
          setPdfFile(objectUrl);
        } catch (error) {
          console.error("Error fetching main plan:", error);
        }
      };
      fetchPdf();
    } else {
      console.log("Main plan URL is not yet available.");
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mainPlanUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0]!;
    if (!file) return;

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await result.json()) as { storageId: string };

    // Step 3: Save the storageId to the project
    await sendImage({ storageId, projectId: project._id });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    try {
      const { pdfId, fileName, thumbnailUrl } = JSON.parse(data) as { pdfId: string; fileName: string; thumbnailUrl?: string; };
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = (rect.width - containerDims.width) / 2;
      const offsetY = (rect.height - containerDims.height) / 2;

      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const x = (clientX - offsetX) / pdfScale;
      const y = (clientY - offsetY) / pdfScale;

      await createPin({
        projectId: project._id,
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
    <div
      ref={containerRef}
      id="plan-viewer-container"
      className="flex-grow bg-gray-200 flex items-center justify-center relative overflow-hidden"
    >
      <Card
        className="w-full h-full flex items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-0 text-center w-full h-full flex items-center justify-center">
          {pdfFile ? (
            <div
              style={{
                position: 'absolute',
                width: containerDims.width,
                height: containerDims.height,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={console.error}
              >
                <Page
                  pageNumber={1}
                  scale={pdfScale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
              <KonvaCanvas
                projectId={project._id}
                mainPlanUrl={mainPlanUrl}
                pdfWidth={containerDims.width}
                pdfHeight={containerDims.height}
              />
            </div>
          ) : mainPlanUrl ? (
            <p>Loading PDF...</p>
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
          style={{
            left: pin.x * pdfScale + (containerRef.current ? (containerRef.current.offsetWidth - containerDims.width) / 2 : 0),
            top: pin.y * pdfScale + (containerRef.current ? (containerRef.current.offsetHeight - containerDims.height) / 2 : 0),
          }}
        >
          <Pin pinId={pin._id} number={index + 1} onClick={handlePinClick} />
        </div>
      ))}
    </div>
  );
};

export default PlanViewer;