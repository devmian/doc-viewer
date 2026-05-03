import type { FeatureCollection, Geometry } from 'geojson';
import mockData from '../data/mockData';

export interface HistoricalEntity {
  id: string;
  nameKey: string;
  descKey: string;
  type: 'dynasty' | 'battle' | 'capital' | 'structure';
  startYear: number;
  endYear: number;
  tags: string[];
  geometry: Geometry;
  lodLevel?: number;
}

interface GeoJSONCache {
  [key: string]: {
    data: FeatureCollection;
    timestamp: number;
  };
}

class HistoryDataService {
  private cache: GeoJSONCache = {};
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private apiUrl: string | null;

  constructor() {
    this.apiUrl = import.meta.env.VITE_HISTORY_API_URL || null;
  }

  async fetchEraData(era: string, lodLevel: number = 1): Promise<FeatureCollection> {
    const cacheKey = `${era}-${lodLevel}`;

    // Check cache first
    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.cacheDuration) {
      return this.cache[cacheKey].data;
    }

    // Try real API if available
    if (this.apiUrl) {
      try {
        const response = await fetch(`${this.apiUrl}/geo/${era}?lod=${lodLevel}`);
        if (response.ok) {
          const data = await response.json();
          this.cache[cacheKey] = { data, timestamp: Date.now() };
          return data;
        }
      } catch (error) {
        console.warn('API fetch failed, falling back to mock data:', error);
      }
    }

    // Fallback to enhanced mock data
    const data = this.getMockData(era, lodLevel);
    this.cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  }

  async searchEntities(query: string, _locale: string): Promise<HistoricalEntity[]> {
    if (this.apiUrl) {
      try {
        const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('API search failed, falling back to local:', error);
      }
    }

    // In a real app with an API, we would search against the localized data.
    // Here, since mockData only has keys, we just search against the keys or tags.
    const lowerQuery = query.toLowerCase();
    return mockData.features
      .filter((f) => {
        const props = f.properties;
        if (!props) return false;
        // Simple search: check if the key or tags contain the query
        return (
          props.nameKey.toLowerCase().includes(lowerQuery) ||
          props.nameKey.toLowerCase().replace('type_dynasty_', '').includes(lowerQuery) ||
          props.tags.some((t: string) => t.toLowerCase().includes(lowerQuery)) ||
          props.descKey.toLowerCase().includes(lowerQuery)
        );
      })
      .map((f) => ({
        id: f.properties!.id,
        nameKey: f.properties!.nameKey,
        descKey: f.properties!.descKey,
        type: (f.properties!.type || 'capital') as HistoricalEntity['type'],
        startYear: f.properties!.startYear,
        endYear: f.properties!.endYear,
        tags: f.properties!.tags,
        geometry: f.geometry as Geometry,
      }));
  }

  getLodLevel(zoom: number): number {
    if (zoom >= 8) return 3;
    if (zoom >= 6) return 2;
    return 1;
  }

  private getFullMockData(): FeatureCollection {
    return mockData as FeatureCollection;
  }

  private getMockData(_era: string, lodLevel: number = 1): FeatureCollection {
    const fullData = this.getFullMockData();
    return {
      type: 'FeatureCollection',
      features: fullData.features.filter((f) => {
        const props = f.properties;
        if (!props) return true;
        return !props.lodLevel || props.lodLevel <= lodLevel;
      }),
    };
  }

  clearCache() {
    this.cache = {};
  }
}

export const historyDataService = new HistoryDataService();
