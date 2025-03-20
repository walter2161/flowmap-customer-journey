import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Save, Upload, Download, FileCode, LayoutTemplate, Plus } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';

export interface FlowControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onScript: () => void;
  onTemplate: () => void;
  onNewCard: () => void;
  onGoogleSheets?: () => void; // Nova prop
  currentProfile?: AssistantProfile;
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
  onGoogleSheets,
  currentProfile
}) => {
  return (
    <aside className="absolute left-4 bottom-4 bg-white/80 backdrop-blur-md rounded shadow-md p-2 flex flex-col gap-2 z-50">
      <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onReset} title="Reset View">
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onSave} title="Save Flow">
        <Save className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onLoad} title="Load Flow">
        <Upload className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onExport} title="Export Flow">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onScript} title="Generate Script">
        <FileCode className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onTemplate} title="Load Template">
        <LayoutTemplate className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onNewCard} title="New Card">
        <Plus className="h-4 w-4" />
      </Button>
      {onGoogleSheets && (
        <Button variant="outline" size="icon" onClick={onGoogleSheets} title="Google Sheets">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table"><path d="M12 22H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h9"/><path d="M21 22h-9V2"/><path d="M2 12h20"/></svg>
        </Button>
      )}
      {currentProfile && (
        <div className="text-xs text-gray-500 mt-2">
          Assistente: {currentProfile.name}
        </div>
      )}
    </aside>
  );
};

export default FlowControls;
