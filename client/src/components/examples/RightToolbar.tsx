import { RightToolbar } from '../RightToolbar';
import { useState } from 'react';

export default function RightToolbarExample() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-screen bg-background">
      <RightToolbar
        zoom={zoom}
        onZoomChange={(newZoom) => {
          console.log('Zoom changed:', newZoom);
          setZoom(newZoom);
        }}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={false}
        userCount={3}
      />
    </div>
  );
}
