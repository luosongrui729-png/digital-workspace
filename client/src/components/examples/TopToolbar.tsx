import { TopToolbar } from '../TopToolbar';
import { useState } from 'react';

export default function TopToolbarExample() {
  const [activeTool, setActiveTool] = useState('select');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#FFFFFF');
  const [penSize, setPenSize] = useState(5);
  const [penOpacity, setPenOpacity] = useState(100);
  const [penType, setPenType] = useState('standard');
  const [zoom, setZoom] = useState(100);

  const canvases = [
    {
      id: '1',
      name: 'My Canvas',
      code: 'A1B2C3',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  return (
    <div className="bg-background">
      <TopToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        strokeColor={strokeColor}
        fillColor={fillColor}
        onStrokeColorChange={setStrokeColor}
        onFillColorChange={setFillColor}
        penSize={penSize}
        onPenSizeChange={setPenSize}
        penOpacity={penOpacity}
        onPenOpacityChange={setPenOpacity}
        penType={penType}
        onPenTypeChange={setPenType}
        zoom={zoom}
        onZoomChange={setZoom}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={false}
        canvases={canvases}
        currentCanvasId="1"
        onCanvasSelect={(id) => console.log('Select canvas:', id)}
        onCanvasCreate={() => console.log('Create canvas')}
        onCanvasRename={(id, name) => console.log('Rename:', id, name)}
        onCanvasDelete={(id) => console.log('Delete:', id)}
        onExport={() => console.log('Export')}
        onShare={() => console.log('Share')}
        onImageInsert={() => console.log('Insert image')}
        isConnected={true}
        userCount={3}
      />
    </div>
  );
}
