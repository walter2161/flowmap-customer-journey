
import React from 'react';
import { Plus, Minus, RotateCw, Download, Upload, Save, FileText, LayoutTemplate, PlusCircle } from 'lucide-react';

interface FlowControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onScript?: () => void;
  onTemplate?: () => void;
  onNewCard?: () => void;
  onExportJson?: () => void;
  onGenerateScript?: () => void;
  onLoadTemplate?: () => void;
  onFitView?: () => boolean | void;
}

const FlowControls: React.FC<FlowControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onSave,
  onLoad,
  onExport,
  onScript,
  onTemplate,
  onNewCard,
  onExportJson,
  onGenerateScript,
  onLoadTemplate,
  onFitView
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-white p-2 rounded-lg shadow-md flex flex-col space-y-2">
        <button
          onClick={onZoomIn}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <Minus size={20} />
        </button>
        {onFitView && (
          <button
            onClick={onFitView}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Fit View"
          >
            <RotateCw size={20} />
          </button>
        )}
      </div>

      <div className="bg-white p-2 rounded-lg shadow-md flex flex-col space-y-2">
        {onExportJson && (
          <button
            onClick={onExportJson}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Export JSON"
          >
            <Download size={20} />
          </button>
        )}
        {onGenerateScript && (
          <button
            onClick={onGenerateScript}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Generate Script"
          >
            <FileText size={20} />
          </button>
        )}
        {onLoadTemplate && (
          <button
            onClick={onLoadTemplate}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Load Template"
          >
            <LayoutTemplate size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FlowControls;
