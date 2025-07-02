import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";


interface PdfLibraryProps {
  projectId: string;
}

const PdfLibrary: React.FC<PdfLibraryProps> = ({ projectId }) => {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const addPdfToLibrary = useMutation(api.projects.addPdfToLibrary);
  const pdfs = useQuery(api.projects.listPdfsInLibrary, { projectId });

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

    // Generate thumbnail
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(getDocument as any).version}/pdf.worker.min.js`;

      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
      const loadingTask = getDocument(typedArray);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Get the first page for thumbnail
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext, viewport }).promise;
      const thumbnailUrl = canvas.toDataURL(); // Get data URL of the thumbnail

      // Step 3: Save the storageId, fileName, and thumbnailUrl to the project's PDF library
      await addPdfToLibrary({ projectId, storageId, fileName: file.name, thumbnailUrl });
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-80 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">PDF Library</h2>
      <Card className="flex items-center justify-center p-4 text-center mb-4">
        <CardContent className="p-0">
          <p className="text-gray-500 mb-2">Upload PDF</p>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </CardContent>
      </Card>
      <div className="pdf-thumbnails">
        {pdfs?.map((pdf) => (
          <div key={pdf._id} className="mb-2 p-2 border rounded bg-white"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify({
                pdfId: pdf._id,
                fileName: pdf.fileName,
                thumbnailUrl: pdf.thumbnailUrl,
              }));
            }}
          >
            {pdf.thumbnailUrl && <img src={pdf.thumbnailUrl} alt="PDF Thumbnail" className="w-full h-auto mb-2" />}
            <p className="text-sm font-medium">{pdf.fileName}</p>
            {/* Thumbnail will be rendered here later */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfLibrary;
