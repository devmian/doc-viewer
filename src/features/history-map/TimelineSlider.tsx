import React, { useRef, useEffect, useMemo } from 'react';
import { useHistoryMapStore } from './store/useMapStore';
import { useI18n } from '../../hooks/useI18n';

interface DynastyRange {
  nameKey: string;
  startYear: number;
  endYear: number;
  color: string;
  // -1 = 在轴下方, 0 = 在轴上, 1 = 在轴上方
  position: -1 | 0 | 1;
}

const dynastyRanges: DynastyRange[] = [
  { nameKey: 'type_dynasty_shang', startYear: -1600, endYear: -1047, color: '#4b5563', position: 0 },
  { nameKey: 'type_dynasty_zhou', startYear: -1046, endYear: -257, color: '#059669', position: 0 },
  { nameKey: 'type_spring_autumn', startYear: -770, endYear: -477, color: '#84cc16', position: 0 },
  { nameKey: 'type_warring_states', startYear: -475, endYear: -222, color: '#22c55e', position: 0 },
  { nameKey: 'type_dynasty_qin', startYear: -221, endYear: -207, color: '#1f2937', position: 1 },
  { nameKey: 'type_dynasty_han', startYear: -202, endYear: 219, color: '#dc2626', position: 0 },
  { nameKey: 'type_three_kingdoms', startYear: 220, endYear: 279, color: '#f97316', position: 1 },
  { nameKey: 'type_dynasty_jin', startYear: 281, endYear: 419, color: '#14b8a6', position: 0 },
  { nameKey: 'type_southern_northern', startYear: 420, endYear: 589, color: '#ec4899', position: 0 },
  { nameKey: 'type_dynasty_sui', startYear: 590, endYear: 617, color: '#06b6d4', position: 1 },
  { nameKey: 'type_dynasty_tang', startYear: 619, endYear: 906, color: '#f59e0b', position: 0 },
  { nameKey: 'type_five_dynasties', startYear: 908, endYear: 959, color: '#a855f7', position: 1 },
  { nameKey: 'type_dynasty_song', startYear: 960, endYear: 1279, color: '#2563eb', position: 0 },
  { nameKey: 'type_dynasty_yuan', startYear: 1271, endYear: 1367, color: '#7c3aed', position: 0 },
  { nameKey: 'type_dynasty_ming', startYear: 1368, endYear: 1643, color: '#db2777', position: 0 },
  { nameKey: 'type_dynasty_qing', startYear: 1644, endYear: 1911, color: '#eab308', position: 0 },
];

const MIN_YEAR = -1600;
const MAX_YEAR = 1912;
const TOTAL_YEARS = MAX_YEAR - MIN_YEAR;

const yearToPercent = (year: number) => ((year - MIN_YEAR) / TOTAL_YEARS) * 100;

const TimelineSlider: React.FC = () => {
  const { currentYear, setYear, isClassroomMode: _isClassroomMode, isPlaying, setIsPlaying } = useHistoryMapStore();
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

  const segments = useMemo(() => {
    return dynastyRanges.map((d) => {
      const left = yearToPercent(d.startYear);
      const width = Math.max(yearToPercent(d.endYear) - left, 0.5);
      return { ...d, left, width };
    });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-700 p-2">
        
        {/* 顶部标签 */}
        <div className="relative h-12 mb-1">
          {segments.map((seg, idx) => (
            <div
              key={`label-${idx}`}
              className="absolute flex flex-col items-center cursor-pointer group pointer-events-auto"
              style={{
                left: `${seg.left}%`,
                bottom: seg.position === 1 ? '20px' : '0px',
                transform: 'translateX(-50%)',
              }}
              onClick={() => setYear(seg.startYear)}
            >
              <span 
                className={`text-[10px] font-bold whitespace-nowrap transition-all px-1 py-0.5 rounded ${
                  seg.position === 1
                    ? 'bg-gray-700 text-white ring-1 ring-gray-500' 
                    : 'bg-gray-800/70 text-gray-400 group-hover:text-white group-hover:bg-gray-700'
                }`}
              >
                {t(seg.nameKey)}
              </span>
              <div 
                className="w-px bg-gray-500 transition-all group-hover:bg-white"
                style={{
                  height: seg.position === 1 ? '12px' : '6px',
                  marginTop: '2px',
                  opacity: 0.5
                }}
              />
            </div>
          ))}
        </div>

        {/* 轨道 */}
        <div className="relative h-4 px-1">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 rounded-full transform -translate-y-1/2">
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
                onClick={() => setYear(seg.startYear)}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 bg-black/90 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  {t(seg.nameKey)}: {formatYear(seg.startYear)}-{formatYear(seg.endYear)}
                </div>
              </div>
            ))}
          </div>

          {/* 游标 */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] pointer-events-none z-20"
            style={{ left: `${yearToPercent(currentYear)}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow border border-blue-500" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow border border-blue-500" />
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

        {/* 底部控制 */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{formatYear(currentYear)}</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-700/50 text-gray-400 rounded border border-gray-600">
              {t('history_map')}
            </span>
          </div>
          <button
            className={`text-[10px] px-2 py-0.5 rounded transition-all font-medium ${
              isPlaying 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
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