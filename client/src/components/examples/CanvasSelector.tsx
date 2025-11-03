import { CanvasSelector } from '../CanvasSelector';
import { useState } from 'react';

export default function CanvasSelectorExample() {
  const [canvases, setCanvases] = useState([
    {
      id: '1',
      name: 'Design Wireframes',
      code: 'A1B2C3',
      createdAt: new Date('2025-11-01'),
      modifiedAt: new Date('2025-11-02'),
    },
    {
      id: '2',
      name: 'Team Brainstorm',
      code: 'D4E5F6',
      createdAt: new Date('2025-10-28'),
      modifiedAt: new Date('2025-11-01'),
    },
    {
      id: '3',
      name: 'Product Sketch',
      code: 'G7H8I9',
      createdAt: new Date('2025-10-25'),
      modifiedAt: new Date('2025-10-30'),
    },
  ]);
  const [currentCanvasId, setCurrentCanvasId] = useState('1');

  return (
    <div className="p-4 bg-background">
      <CanvasSelector
        canvases={canvases}
        currentCanvasId={currentCanvasId}
        onCanvasSelect={(id) => {
          console.log('Canvas selected:', id);
          setCurrentCanvasId(id);
        }}
        onCanvasCreate={() => {
          console.log('Create new canvas');
          const newCanvas = {
            id: String(canvases.length + 1),
            name: 'Untitled Canvas',
            code: `X${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            createdAt: new Date(),
            modifiedAt: new Date(),
          };
          setCanvases([...canvases, newCanvas]);
          setCurrentCanvasId(newCanvas.id);
        }}
        onCanvasRename={(id, newName) => {
          console.log('Rename canvas:', id, newName);
          setCanvases(canvases.map(c => c.id === id ? { ...c, name: newName } : c));
        }}
        onCanvasDelete={(id) => {
          console.log('Delete canvas:', id);
          setCanvases(canvases.filter(c => c.id !== id));
          if (currentCanvasId === id && canvases.length > 1) {
            setCurrentCanvasId(canvases.find(c => c.id !== id)!.id);
          }
        }}
      />
    </div>
  );
}
