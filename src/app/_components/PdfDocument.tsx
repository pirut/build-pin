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
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    if (pdf.url) {
      const fetchPdf = async () => {
        const response = await fetch(pdf.url!);
        const blob = await response.blob();
        setPdfFile(new File([blob], pdf.fileName));
      };
      fetchPdf();
    }
  }, [pdf.url, pdf.fileName]);

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
