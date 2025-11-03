import { Toolbar } from '../Toolbar';
import { useState } from 'react';

export default function ToolbarExample() {
  const [activeTool, setActiveTool] = useState('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(100);
  
  const canvases = [
    {
      id: '1',
      name: 'Design Wireframes',
      code: 'A1B2C3',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  const users = [
    { id: '1', name: 'User 1', color: '#FF6B6B', tool: 'Pen' },
    { id: '2', name: 'User 2', color: '#4ECDC4', tool: 'Shape' },
  ];

  return (
    <div className="bg-background">
      <Toolbar
        activeTool={activeTool}
        onToolChange={(tool) => {
          console.log('Tool changed:', tool);
          setActiveTool(tool);
        }}
        strokeColor={strokeColor}
        fillColor={fillColor}
        onStrokeColorChange={(color) => {
          console.log('Stroke color changed:', color);
          setStrokeColor(color);
        }}
        onFillColorChange={(color) => {
          console.log('Fill color changed:', color);
          setFillColor(color);
        }}
        zoom={zoom}
        onZoomChange={(newZoom) => {
          console.log('Zoom changed:', newZoom);
          setZoom(newZoom);
        }}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={true}
        canvases={canvases}
        currentCanvasId="1"
        onCanvasSelect={(id) => console.log('Canvas selected:', id)}
        onCanvasCreate={() => console.log('Create canvas')}
        onCanvasRename={(id, name) => console.log('Rename canvas:', id, name)}
        onCanvasDelete={(id) => console.log('Delete canvas:', id)}
        users={users}
        isConnected={true}
        onExport={(format, options) => console.log('Export:', format, options)}
        onJoinCanvas={(code) => console.log('Join canvas:', code)}
        currentCanvasCode="A1B2C3"
        onImageInsert={() => console.log('Insert image')}
      />
    </div>
  );
}
