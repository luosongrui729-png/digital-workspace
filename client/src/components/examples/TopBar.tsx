import { TopBar } from '../TopBar';
import { useState } from 'react';

export default function TopBarExample() {
  const [canvases] = useState([
    {
      id: '1',
      name: 'My Canvas',
      code: 'A1B2C3',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ]);

  return (
    <div className="bg-background">
      <TopBar
        canvases={canvases}
        currentCanvasId="1"
        onCanvasSelect={(id) => console.log('Select:', id)}
        onCanvasCreate={() => console.log('Create canvas')}
        onCanvasRename={(id, name) => console.log('Rename:', id, name)}
        onCanvasDelete={(id) => console.log('Delete:', id)}
        onExport={(format, options) => console.log('Export:', format, options)}
        onShare={(code) => console.log('Share:', code)}
        isConnected={true}
        userCount={3}
        currentCanvasCode="A1B2C3"
      />
    </div>
  );
}
