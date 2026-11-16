import React, { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

interface LetterCanvasProps {
  upper: string;
  lower: string;
}

export const LetterCanvas: React.FC<LetterCanvasProps> = ({ upper, lower }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  useEffect(() => {
    clearCanvas();
  }, [upper, lower]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2563eb';
    isDrawingRef.current = true;
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">
          ივარჯიშე წერაში — შემოხაზე ასო მაუსით ან თითით
        </span>
        <button
          type="button"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer"
        >
          <Eraser className="w-3.5 h-3.5" />
          გასუფთავება
        </button>
      </div>

      <div className="relative h-36 bg-white border border-slate-200 rounded-lg overflow-hidden notebook-lines select-none touch-none">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-display text-7xl font-bold tracking-wider text-slate-200/80"
          aria-hidden="true"
        >
          {upper} {lower}
        </div>
        <canvas
          ref={canvasRef}
          width={480}
          height={180}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative z-10 w-full h-full cursor-crosshair"
        />
      </div>
    </div>
  );
};
