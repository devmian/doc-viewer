import React, { useRef, useEffect, useMemo } from 'react';
import { useHistoryMapStore, type MapEntity } from './store/useMapStore';
import { useI18n } from '../../hooks/useI18n';
import mockData from './data/mockData';

interface DynastyRange {
  nameKey: string;
  startYear: number;
  endYear: number;
  color: string;
  position: -1 | 0 | 1;
}

const dynastyRanges: DynastyRange[] = [
  { nameKey: 'type_dynasty_shang', startYear: -1600, endYear: -1047, color: '#6b7280', position: 0 },
  { nameKey: 'type_dynasty_zhou', startYear: -1046, endYear: -257, color: '#059669', position: 0 },
  { nameKey: 'type_spring_autumn', startYear: -770, endYear: -477, color: '#84cc16', position: 0 },
  { nameKey: 'type_warring_states', startYear: -475, endYear: -222, color: '#22c55e', position: 0 },
  { nameKey: 'type_dynasty_qin', startYear: -221, endYear: -207, color: '#374151', position: -1 },
  { nameKey: 'type_dynasty_han', startYear: -202, endYear: 219, color: '#dc2626', position: 0 },
  { nameKey: 'type_three_kingdoms', startYear: 220, endYear: 279, color: '#f97316', position: -1 },
  { nameKey: 'type_dynasty_jin', startYear: 281, endYear: 419, color: '#14b8a6', position: 0 },
  { nameKey: 'type_southern_northern', startYear: 420, endYear: 589, color: '#ec4899', position: 0 },
  { nameKey: 'type_dynasty_sui', startYear: 590, endYear: 617, color: '#06b6d4', position: -1 },
  { nameKey: 'type_dynasty_tang', startYear: 619, endYear: 906, color: '#f59e0b', position: 0 },
  { nameKey: 'type_five_dynasties', startYear: 908, endYear: 959, color: '#a855f7', position: -1 },
  { nameKey: 'type_dynasty_song', startYear: 960, endYear: 1279, color: '#5b6ef5', position: 0 },
  { nameKey: 'type_dynasty_yuan', startYear: 1271, endYear: 1367, color: '#7c3aed', position: 0 },
  { nameKey: 'type_dynasty_ming', startYear: 1368, endYear: 1643, color: '#db2777', position: 0 },
  { nameKey: 'type_dynasty_qing', startYear: 1644, endYear: 1911, color: '#eab308', position: 0 },
];

const MIN_YEAR = -1600;
const MAX_YEAR = 1912;
const TOTAL_YEARS = MAX_YEAR - MIN_YEAR;

const yearToPercent = (year: number) => ((year - MIN_YEAR) / TOTAL_YEARS) * 100;

// Build a lookup: nameKey -> MapEntity from mockData
const entityByNameKey: Record<string, MapEntity> = {};
for (const feat of mockData.features) {
  const p = feat.properties;
  if (p && p.nameKey) {
    entityByNameKey[p.nameKey] = {
      id: p.id,
      nameKey: p.nameKey,
      descKey: p.descKey,
      type: (p.type as MapEntity['type']) || 'dynasty',
      startYear: p.startYear,
      endYear: p.endYear,
      tags: p.tags || [],
    };
  }
}

const TimelineSlider: React.FC = () => {
  const { currentYear, setYear, selectEntity, selectedEntity, isClassroomMode: _isClassroomMode, isPlaying, setIsPlaying } = useHistoryMapStore();
  const intervalRef = useRef<number | null>(null);
  const { t } = useI18n();

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} ${t('era_bc')}` : `${year} ${t('era_ad')}`;
  };

  const handlePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = window.setInterval(() => {
        const current = useHistoryMapStore.getState().currentYear;
        if (current >= 1912) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          return;
        }
        setYear(current + 5);
      }, 200);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDynastyClick = (seg: DynastyRange) => {
    setYear(seg.startYear);
    const entity = entityByNameKey[seg.nameKey];
    if (entity) {
      selectEntity(entity);
    }
  };

  const segments = useMemo(() => {
    return dynastyRanges.map((d) => {
      const left = yearToPercent(d.startYear);
      const width = Math.max(yearToPercent(d.endYear) - left, 0.5);
      return { ...d, left, width };
    });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full p-2 rounded-xl" style={{
        background: 'var(--bg-primary)',
        boxShadow: 'var(--shadow-extruded)'
      }}>
        
        {/* 顶部标签 */}
        <div className="relative h-10 mb-1">
            {segments.filter(s => s.position >= 0).map((seg, idx) => {
              const isActive = selectedEntity?.nameKey === seg.nameKey;
              return (
              <div
                key={`label-${idx}`}
                className="absolute flex flex-col items-center cursor-pointer group pointer-events-auto"
                style={{
                  left: `${seg.left}%`,
                  bottom: '0px',
                  transform: 'translateX(-50%)',
                }}
                onClick={() => handleDynastyClick(seg)}
              >
                <span 
                  className={`text-[10px] font-bold whitespace-nowrap transition-all px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'text-white font-bold' 
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                  style={{
                    background: isActive ? 'var(--brand-primary)' : 'var(--inset-bg)',
                    boxShadow: isActive ? 'var(--shadow-extruded-sm)' : 'none'
                  }}
                >
                  {t(seg.nameKey)}
                </span>
                <div 
                  className="w-px transition-all mt-0.5"
                  style={{
                    backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--border-primary)',
                    height: '6px',
                    opacity: isActive ? 1 : 0.5
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 轨道 */}
        <div className="relative h-4 px-1">
          <div className="absolute top-1/2 left-0 right-0 h-1 rounded-full transform -translate-y-1/2" style={{
            background: 'var(--inset-bg)',
            boxShadow: 'var(--shadow-inset-sm)'
          }}>
            {segments.map((seg, idx) => (
              <div
                key={`bar-${idx}`}
                className="absolute top-0 bottom-0 hover:brightness-125 transition-all cursor-pointer group"
                style={{
                  left: `${seg.left}%`,
                  width: `${seg.width}%`,
                  backgroundColor: seg.color,
                  opacity: 0.85,
                  minWidth: '2px'
                }}
                onClick={() => handleDynastyClick(seg)}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap" style={{
                  background: 'var(--bg-primary)',
                  boxShadow: 'var(--shadow-extruded-sm)',
                  color: 'var(--text-primary)'
                }}>
                  {t(seg.nameKey)}: {formatYear(seg.startYear)}-{formatYear(seg.endYear)}
                </div>
              </div>
            ))}
          </div>

          {/* 游标 */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-20"
            style={{
              left: `${yearToPercent(currentYear)}%`,
              backgroundColor: 'var(--brand-primary)',
              boxShadow: '0 0 6px var(--brand-primary)'
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow" style={{
              backgroundColor: 'var(--brand-primary)',
              border: '2px solid var(--bg-primary)'
            }} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow" style={{
              backgroundColor: 'var(--brand-primary)',
              border: '2px solid var(--bg-primary)'
            }} />
          </div>
          
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={currentYear}
            onChange={(e) => setYear(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
        </div>

        {/* 底部标签 */}
        <div className="relative h-8 mb-1">
          {segments.filter(s => s.position === -1).map((seg, idx) => {
            const isActive = selectedEntity?.nameKey === seg.nameKey;
            return (
              <div
                key={`bottom-label-${idx}`}
                className="absolute flex flex-col items-center cursor-pointer group pointer-events-auto"
                style={{
                  left: `${seg.left}%`,
                  top: '0px',
                  transform: 'translateX(-50%)',
                }}
                onClick={() => handleDynastyClick(seg)}
              >
                <div 
                  className="w-px transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--border-primary)',
                    height: '6px',
                    opacity: isActive ? 1 : 0.5
                  }}
                />
                <span 
                  className={`text-[10px] font-bold whitespace-nowrap transition-all px-1.5 py-0.5 rounded mt-0.5 ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                  style={{
                    background: isActive ? 'var(--brand-primary)' : 'var(--inset-bg)',
                    boxShadow: isActive ? 'var(--shadow-extruded-sm)' : 'none'
                  }}
                >
                  {t(seg.nameKey)}
                </span>
              </div>
            );
          })}
        </div>

        {/* 底部控制 */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{formatYear(currentYear)}</span>
            <span className="text-[9px] px-1.5 py-0.5 text-[var(--text-secondary)] rounded" style={{
              background: 'var(--inset-bg)',
              boxShadow: 'var(--shadow-inset-sm)'
            }}>
              {t('history_map')}
            </span>
          </div>
          <button
            className={`text-[10px] px-2 py-0.5 rounded font-medium transition-all ${
              isPlaying 
                ? 'text-red-400' 
                : 'text-white'
            }`}
            style={{
              background: isPlaying ? 'var(--inset-bg)' : 'var(--brand-primary)',
              boxShadow: isPlaying ? 'var(--shadow-inset-sm)' : 'var(--shadow-extruded-sm)'
            }}
            onClick={handlePlay}
          >
            {isPlaying ? t('pause') : t('play')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
