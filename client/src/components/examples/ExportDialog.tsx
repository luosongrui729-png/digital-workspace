import { ExportDialog } from '../ExportDialog';

export default function ExportDialogExample() {
  return (
    <div className="p-4 bg-background">
      <ExportDialog
        onExport={(format, options) => {
          console.log('Export requested:', format, options);
        }}
      />
    </div>
  );
}
