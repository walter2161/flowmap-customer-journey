
// Fixing the typo in the onLoad property of FlowControls
// Replace onLoadLoad with onLoad in line 505

<FlowControls
  onZoomIn={zoomIn}
  onZoomOut={zoomOut}
  onReset={onResetView}
  onSave={onSaveFlow}
  onLoad={onLoad}
  onExport={onExportFlow}
  onScript={onGenerateScript}
  onTemplate={() => setTemplateModalOpen(true)}
  onNewCard={handleNewCard}
  currentProfile={currentProfile}
/>
