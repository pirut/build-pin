import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Id } from '../../../convex/_generated/dataModel';

interface PdfDocumentProps {
  pdf: {
    _id: Id<"pdfs">;
    fileName: string;
    url?: string | null;
  };
  onDragStart: (event: React.DragEvent<HTMLDivElement>, pdf: any) => void;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ pdf, onDragStart }) => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (pdf.url) {
      console.log(`Fetching PDF: ${pdf.fileName} from ${pdf.url}`);
      const fetchPdf = async () => {
        try {
          const response = await fetch(pdf.url!);
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
          }
          const blob = await response.blob();
          console.log(`Successfully fetched blob for ${pdf.fileName}, size: ${blob.size}`);
          objectUrl = URL.createObjectURL(blob);
          setPdfFile(objectUrl);
        } catch (error) {
          console.error(`Error fetching PDF ${pdf.fileName}:`, error);
        }
      };
      fetchPdf();
    } else {
      console.warn(`PDF object for ${pdf.fileName} is missing a URL.`);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdf.url]);

  return (
    <Card
      key={pdf._id}
      className="cursor-grab"
      draggable
      onDragStart={(e) => onDragStart(e, { ...pdf, pdfFile })}
    >
      <CardContent className="p-2">
        {pdfFile ? (
          <Document file={pdfFile} onLoadError={console.error}>
            <Page pageNumber={1} width={100} renderAnnotationLayer={false} renderTextLayer={false} />
          </Document>
        ) : (
          <div>Loading PDF...</div>
        )}
        <p className="text-xs mt-1 truncate">{pdf.fileName}</p>
      </CardContent>
    </Card>
  );
};

export default PdfDocument;
