import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useHistoryMapStore, type MapEntity } from './store/useMapStore';
import { historyDataService } from './services/historyDataService';
import { useI18n } from '../../hooks/useI18n';

const createIcon = (type: string) => {
  const colors: Record<string, { bg: string; size: number }> = {
    battle: { bg: '#EF4444', size: 14 },
    capital: { bg: '#FBBF24', size: 16 },
    structure: { bg: '#60A5FA', size: 12 },
  };
  const config = colors[type] || { bg: '#10B981', size: 12 };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${config.bg}; width: ${config.size}px; height: ${config.size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: transform 0.2s ease;"></div>`,
    iconSize: [config.size + 4, config.size + 4],
    iconAnchor: [(config.size + 4) / 2, (config.size + 4) / 2],
  });
};

const getEraFromYear = (year: number): string => {
  if (year < -1046) return 'shang';
  if (year < -256) return 'zhou';
  if (year < -206) return 'qin';
  if (year < 220) return 'han';
  if (year < 581) return 'northern-southern';
  if (year < 618) return 'sui';
  if (year < 907) return 'tang';
  if (year < 960) return 'five-dynasties';
  if (year < 1127) return 'northern-song';
  if (year < 1279) return 'southern-song';
  if (year < 1368) return 'yuan';
  if (year < 1644) return 'ming';
  return 'qing';
};

const MapEventHandler: React.FC = () => {
  const { setCurrentZoom, setLodLevel } = useHistoryMapStore();
  const lodTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    const handleZoom = () => {
      setCurrentZoom(5);
      if (lodTimeoutRef.current) clearTimeout(lodTimeoutRef.current);
      lodTimeoutRef.current = window.setTimeout(() => {
        const newLod = historyDataService.getLodLevel(5);
        setLodLevel(newLod);
      }, 300);
    };

    handleZoom();
    return () => {
      if (lodTimeoutRef.current) clearTimeout(lodTimeoutRef.current);
    };
  }, [setCurrentZoom, setLodLevel]);

  return null;
};

const MapContent: React.FC = () => {
  const { currentYear, setSelectedEntity, lodLevel } = useHistoryMapStore();
  const { t } = useI18n();
  const [markers, setMarkers] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [polygons, setPolygons] = useState<any[]>([]);
  const lastYearRef = useRef<number>(0);

const loadData = useCallback(async () => {
    const year = useHistoryMapStore.getState().currentYear;
    
    // Skip if same year
    if (year === lastYearRef.current) return;
    lastYearRef.current = year;
    
    setMarkers([]);
    setLines([]);
    setPolygons([]);
    
    const era = getEraFromYear(year);
    try {
      const data = await historyDataService.fetchEraData(era, lodLevel);
      
      const points: any[] = [];
      const lineFeatures: any[] = [];
      const polygonFeatures: any[] = [];
      
      data.features.forEach((feature: any) => {
        if (year >= feature.properties.startYear && year <= feature.properties.endYear) {
          const id = feature.properties.id;
          
          // Skip zhou when more specific periods are active (spring_autumn: -770~-477, warring_states: -475~-222)
          if (id === 'zhou-dynasty' && year >= -770) return;
          
          // Skip song when yuan is active (1271+)
          if (id === 'song-dynasty' && year >= 1271) return;
          
          if (feature.geometry.type === 'Point') {
            points.push(feature);
          } else if (feature.geometry.type === 'LineString') {
            lineFeatures.push(feature);
          } else if (feature.geometry.type === 'Polygon') {
            polygonFeatures.push(feature);
          }
        }
      });

      setMarkers(points);
      setLines(lineFeatures);
      setPolygons(polygonFeatures);
    } catch (error) {
      console.error('Failed to load map data:', error);
    }
  }, [currentYear, lodLevel]);

  useEffect(() => {
    loadData();
  }, [currentYear, loadData]);

  const handlePointClick = (feature: any) => {
    const entity: MapEntity = {
      id: feature.properties.id,
      nameKey: feature.properties.nameKey,
      descKey: feature.properties.descKey,
      type: feature.properties.type || 'capital',
      startYear: feature.properties.startYear,
      endYear: feature.properties.endYear,
      tags: feature.properties.tags,
    };
    setSelectedEntity(entity);
  };

  const polygonStyle = {
    color: '#EF4444',
    weight: 2,
    opacity: 0.8,
    fillColor: '#EF4444',
    fillOpacity: 0.4,
  };

  const lineStyle = {
    color: '#60A5FA',
    weight: 4,
    opacity: 0.9,
    dashArray: '10, 8',
  };

  const onPolygonEachFeature = (_feature: any, layer: L.Layer) => {
    const layerWithPath = layer as L.Path;
    layerWithPath.on({
      mouseover: () => {
        layerWithPath.setStyle({ weight: 4, color: '#FBBF24', fillOpacity: 0.6 });
      },
      mouseout: () => {
        layerWithPath.setStyle(polygonStyle);
      },
      click: () => handlePointClick(_feature),
    });
  };

  const onLineEachFeature = (_feature: any, layer: L.Layer) => {
    const layerWithPath = layer as L.Path;
    layerWithPath.on({
      mouseover: () => {
        layerWithPath.setStyle({ weight: 6, color: '#FBBF24' });
      },
      mouseout: () => {
        layerWithPath.setStyle(lineStyle);
      },
      click: () => handlePointClick(_feature),
    });
  };

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} ${t('era_bc')}` : `${year} ${t('era_ad')}`;
  };

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapEventHandler />
      
      {polygons.length > 0 && (
        <GeoJSON
          key={`poly-${currentYear}-${lodLevel}`}
          data={{ type: 'FeatureCollection', features: polygons } as any}
          style={polygonStyle}
          onEachFeature={onPolygonEachFeature}
        />
      )}
      
      {lines.length > 0 && (
        <GeoJSON
          key={`line-${currentYear}-${lodLevel}`}
          data={{ type: 'FeatureCollection', features: lines } as any}
          style={lineStyle}
          onEachFeature={onLineEachFeature}
        />
      )}
      
      {markers.map((feature: any, idx: number) => (
        <Marker
          key={`marker-${feature.properties.id}-${idx}`}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={createIcon(feature.properties.type || 'default')}
          eventHandlers={{
            click: () => handlePointClick(feature),
          }}
        >
          <Popup className="history-popup">
            <div className="p-3 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  feature.properties.type === 'battle' ? 'bg-red-500' :
                  feature.properties.type === 'capital' ? 'bg-yellow-500' :
                  feature.properties.type === 'structure' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <h3 className="font-bold text-gray-900">{t(feature.properties.nameKey)}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{t(feature.properties.descKey)}</p>
              <div className="flex flex-wrap gap-1">
                {feature.properties.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">{tag}</span>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {formatYear(feature.properties.startYear)} - {formatYear(feature.properties.endYear)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const MapViewer: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[34.0, 108.0]}
        zoom={5}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <MapContent />
      </MapContainer>
    </div>
  );
};

export default MapViewer;