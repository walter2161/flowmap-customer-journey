
import React from 'react';
import { Plus, Minus, RotateCw, Download, Upload, Save, FileText, LayoutTemplate, PlusCircle } from 'lucide-react';

interface FlowControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onScript: () => void;
  onTemplate: () => void;
  onNewCard: () => void;
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
  onNewCard
}) => {
  return (
    <>
      {/* File operations */}
      <div className="p-2">
        <div className="flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-100 flex flex-col gap-2">
            <button
              onClick={onSave}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Save Flow"
            >
              <Save className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onLoad}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Load Flow"
            >
              <Upload className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onExport}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Export Flow"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-100 flex flex-col gap-2">
            <button
              onClick={onNewCard}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Criar Novo Cartão"
            >
              <PlusCircle className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onScript}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Gerar Script AI"
            >
              <FileText className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onTemplate}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Escolher Template"
            >
              <LayoutTemplate className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="p-2 absolute bottom-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-100 flex flex-col gap-2">
          <button
            onClick={onZoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Zoom In"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Reset View"
          >
            <RotateCw className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </>
  );
};

export default FlowControls;
