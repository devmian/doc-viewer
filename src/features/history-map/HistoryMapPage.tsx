import React from 'react';
import MapViewer from './MapViewer';
import TimelineSlider from './TimelineSlider';
import InfoPanel from './InfoPanel';

const HistoryMapPage: React.FC = () => {
  return (
    <div className="relative" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Map */}
      <div className="absolute inset-0">
        <MapViewer />
      </div>
      
      {/* Timeline - bottom, floating above map */}
      <div className="absolute bottom-2 left-2 right-2 z-[1000] pointer-events-none">
        <TimelineSlider />
      </div>
      
      {/* Info Panel - top right */}
      <div className="absolute top-2 right-2 z-[1000]">
        <InfoPanel />
      </div>
    </div>
  );
};

export default HistoryMapPage;