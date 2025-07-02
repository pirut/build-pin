"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Stage, Layer, Line, Rect } from 'react-konva';
import Konva from 'konva';
import { Button } from "@/components/ui/button";

type Tool = 'pen' | 'rectangle' | 'select';

interface KonvaCanvasProps {
  projectId: string;
  mainPlanUrl: string | undefined;
}

const KonvaCanvas: React.FC<KonvaCanvasProps> = ({ projectId, mainPlanUrl }) => {
  const addMarkup = useMutation(api.projects.addMarkup);
  const markups = useQuery(api.projects.listMarkups, projectId ? { projectId } : "skip");

  const [tool, setTool] = useState<Tool>('pen');
  const [lines, setLines] = useState<any[]>([]);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateStageSize = () => {
      const container = document.getElementById('plan-viewer-container');
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, [mainPlanUrl]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'select') return;
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === 'pen') {
      setLines([...lines, { points: [pos.x, pos.y], stroke: 'red', strokeWidth: 2 }]);
    } else if (tool === 'rectangle') {
      setRectangles([...rectangles, { x: pos.x, y: pos.y, width: 0, height: 0, stroke: 'blue', strokeWidth: 2 }]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || tool === 'select') return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    if (tool === 'pen') {
      let lastLine = lines[lines.length - 1];
      if (!lastLine) return;
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines([...lines]);
    } else if (tool === 'rectangle') {
      let lastRect = rectangles[rectangles.length - 1];
      if (!lastRect) return;
      const newWidth = point.x - lastRect.x;
      const newHeight = point.y - lastRect.y;
      lastRect = { ...lastRect, width: newWidth, height: newHeight };
      rectangles.splice(rectangles.length - 1, 1, lastRect);
      setRectangles([...rectangles]);
    }
  };

  const handleMouseUp = async () => {
    isDrawing.current = false;
    if (tool === 'pen' && lines.length > 0) {
      await addMarkup({
        projectId,
        type: 'line',
        data: lines[lines.length - 1],
      });
    } else if (tool === 'rectangle' && rectangles.length > 0) {
      await addMarkup({
        projectId,
        type: 'rectangle',
        data: rectangles[rectangles.length - 1],
      });
    }
  };

  useEffect(() => {
    if (markups) {
      const loadedLines = markups.filter(m => m.type === 'line').map(m => m.data);
      const loadedRectangles = markups.filter(m => m.type === 'rectangle').map(m => m.data);
      setLines(loadedLines);
      setRectangles(loadedRectangles);
    }
  }, [markups]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 flex space-x-2">
        <Button onClick={() => setTool('select')} variant={tool === 'select' ? 'default' : 'outline'}>Select</Button>
        <Button onClick={() => setTool('pen')} variant={tool === 'pen' ? 'default' : 'outline'}>Pen</Button>
        <Button onClick={() => setTool('rectangle')} variant={tool === 'rectangle' ? 'default' : 'outline'}>Rectangle</Button>
      </div>
      {mainPlanUrl && <img src={mainPlanUrl} alt="Main Floor Plan" className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={stageRef}
        className="absolute top-0 left-0"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {rectangles.map((rect, i) => (
            <Rect
              key={i}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={rect.stroke}
              strokeWidth={rect.strokeWidth}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
