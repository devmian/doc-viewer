import React from 'react';
import { useHistoryMapStore } from './store/useMapStore';
import { X, Calendar, MapPin, Tag } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const InfoPanel: React.FC = () => {
  const { selectedEntity, selectEntity } = useHistoryMapStore();
  const { t } = useI18n();

  if (!selectedEntity) return null;

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} ${t('era_bc')}` : `${year} ${t('era_ad')}`;
  };

  return (
    <div className="absolute top-16 right-4 z-[1000] w-60 bg-gray-900/50 backdrop-blur-xl text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 animate-in slide-in-from-right">
      <div className="px-3 py-2.5 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{t(selectedEntity.nameKey || '') || selectedEntity.id}</h2>
        </div>
        <button 
          onClick={() => selectEntity(null)} 
          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="px-3 py-2.5">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedEntity.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-900/50 text-yellow-400 border border-yellow-700 rounded">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
        
        {selectedEntity.descKey && (
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">{t(selectedEntity.descKey)}</p>
        )}
        
        <div className="space-y-1 mb-0">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} />
            <span>
              {formatYear(selectedEntity.startYear)} - {formatYear(selectedEntity.endYear)}
            </span>
          </div>
          {selectedEntity.type === 'battle' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} />
              <span>Battle location</span>
            </div>
          )}
          {selectedEntity.type === 'capital' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} />
              <span>Capital city</span>
            </div>
          )}
        </div>
        

      </div>
    </div>
  );
};

export default InfoPanel;
