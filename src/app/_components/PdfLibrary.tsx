import React from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { type Id } from "../../../convex/_generated/dataModel";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



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
        {pdfs?.map((pdf: PdfDocument) => (
          <Card
            key={pdf._id}
            className="cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, pdf)}
          >
            <CardContent className="p-2">
              <Document
                file={pdf.storageId ? `https://convex.cloud/api/storage/${pdf.storageId}` : undefined}
                onLoadError={console.error}
              >
                <Page pageNumber={1} width={100} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
              <p className="text-xs mt-1 truncate">{pdf.fileName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PdfLibrary;
