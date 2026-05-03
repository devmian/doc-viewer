import { create } from 'zustand';

export interface MapEntity {
  id: string;
  nameKey?: string;
  descKey?: string;
  type: 'dynasty' | 'battle' | 'capital' | 'structure';
  startYear: number;
  endYear: number;
  tags: string[];
}

interface MapState {
  currentYear: number;
  selectedEntity: MapEntity | null;
  isClassroomMode: boolean;
  lodLevel: number;
  currentZoom: number;
  isPlaying: boolean;
  
  // Actions
  setYear: (year: number) => void;
  selectEntity: (entity: MapEntity | null) => void;
  setSelectedEntity: (entity: MapEntity | null) => void;
  toggleClassroomMode: () => void;
  setLodLevel: (level: number) => void;
  setCurrentZoom: (zoom: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useHistoryMapStore = create<MapState>((set) => ({
  currentYear: -221,
  selectedEntity: null,
  isClassroomMode: false,
  lodLevel: 1,
  currentZoom: 5,
  isPlaying: false,

  setYear: (year) => set({ currentYear: year }),
  selectEntity: (entity) => set({ selectedEntity: entity }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  toggleClassroomMode: () => set((state) => ({ isClassroomMode: !state.isClassroomMode })),
  setLodLevel: (level) => set({ lodLevel: level }),
  setCurrentZoom: (zoom) => set({ currentZoom: zoom }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));
