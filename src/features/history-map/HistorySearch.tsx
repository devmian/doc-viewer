import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useHistoryMapStore } from './store/useMapStore';
import { historyDataService } from './services/historyDataService';
import { useI18n } from '../../hooks/useI18n';

interface SearchResult {
  id: string;
  nameKey: string;
  descKey: string;
  type: string;
  startYear: number;
  endYear: number;
  tags: string[];
  geometry: any;
}

const HistorySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setYear, selectEntity } = useHistoryMapStore();
  const { t, locale } = useI18n();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const debounce = setTimeout(async () => {
      try {
        const searchResults = await historyDataService.searchEntities(query, locale);
        setResults(searchResults.slice(0, 8));
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, locale]);

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    
    selectEntity({
      id: result.id,
      nameKey: result.nameKey,
      descKey: result.descKey,
      type: result.type as any,
      startYear: result.startYear,
      endYear: result.endYear,
      tags: result.tags,
    });
    
    setYear(result.startYear);
  };

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} ${t('era_bc')}` : `${year} ${t('era_ad')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'battle': return 'bg-red-500';
      case 'capital': return 'bg-yellow-500';
      case 'structure': return 'bg-blue-500';
      case 'dynasty': return 'bg-purple-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="relative z-[1000]">
      <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 px-3 py-2 w-64 transition-all duration-300 focus-within:border-blue-500 focus-within:w-80">
        <Search size={18} className="text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder')}
          className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-b-0"
            >
              <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getTypeColor(result.type)}`} />
              <div className="text-left">
                <div className="text-white font-medium text-sm">{t(result.nameKey)}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {formatYear(result.startYear)} - {formatYear(result.endYear)}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 text-sm">
          {t('loading')}
        </div>
      )}

      {!isSearching && isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 text-sm">
          {t('no_results')}
        </div>
      )}
    </div>
  );
};

export default HistorySearch;
