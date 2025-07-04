import React from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { type Id } from "../../../convex/_generated/dataModel";

import PdfDocument from './PdfDocument';




interface PdfLibraryProps {
  projectId: Id<"projects">;
}

interface PdfDocument {
  _id: Id<"pdfs">;
  _creationTime: number;
  projectId: Id<"projects">;
  storageId: Id<"_storage">;
  fileName: string;
  thumbnailUrl?: string;
  url?: string | null;
}

const PdfLibrary: React.FC<PdfLibraryProps> = ({ projectId }) => {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const addPdfToLibrary = useMutation(api.projects.addPdfToLibrary);
  const pdfs = useQuery(api.projects.listPdfsInLibrary, { projectId });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0]!;
    if (!file) return;

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };

    await addPdfToLibrary({
      projectId,
      storageId,
      fileName: file.name,
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pdf: PdfDocument) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({
      pdfId: pdf._id,
      fileName: pdf.fileName,
      thumbnailUrl: pdf.thumbnailUrl,
      url: pdf.url,
    }));
  };

  return (
    <div className="pdf-library">
      <h2 className="text-lg font-bold mb-2">PDF Library</h2>
      <Card className="mb-4">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 mb-2">Upload PDF Documents</p>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        {pdfs === undefined && <p>Loading libraries...</p>}
        {pdfs?.length === 0 && <p>No PDFs in library.</p>}
        {pdfs?.map((pdf: PdfDocument) => (
          <PdfDocument key={pdf._id} pdf={pdf} onDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
};

export default PdfLibrary;
