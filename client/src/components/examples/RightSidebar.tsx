import { RightSidebar } from '../RightSidebar';
import { useState } from 'react';

export default function RightSidebarExample() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-screen bg-background flex justify-end">
      <RightSidebar
        zoom={zoom}
        onZoomChange={setZoom}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={false}
      />
    </div>
  );
}
