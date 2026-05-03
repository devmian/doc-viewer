# History Map API Integration Guide

## Overview
The History Map module supports real API integration with automatic fallback to mock data.

## Configuration

### Environment Variables
Create `.env` file in `projects/doc-viewer/`:

```env
VITE_HISTORY_API_URL=https://your-history-api.com/api
```

### API Endpoints

#### 1. Fetch GeoJSON by Era
```
GET /api/history/geo/{era}?lod={level}
```

**Parameters:**
- `era`: Era identifier (e.g., `qin`, `han`, `tang`)
- `lod`: Level of Detail (1-3)

**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "qin-dynasty",
        "name": "Qin Dynasty",
        "type": "dynasty",
        "startYear": -221,
        "endYear": -207,
        "tags": ["unification", "terracotta"],
        "description": "First unified empire...",
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[...]]]
      }
    }
  ]
}
```

#### 2. Search Entities
```
GET /api/history/search?q={query}
```

**Parameters:**
- `q`: Search query

**Response:**
```json
[
  {
    "id": "qin-dynasty",
    "name": "Qin Dynasty",
    "type": "dynasty",
    "startYear": -221,
    "endYear": -207,
    "tags": ["unification", "terracotta"],
    "description": "First unified empire...",
    "geometry": { "type": "Polygon", "coordinates": [...] }
  }
]
```

## Data Sources

### Recommended GeoJSON Sources
1. **China Historical GIS Project** (Harvard)
   - URL: https://fas.harvard.edu/~chgis/
   - Coverage: Historical Chinese administrative boundaries

2. **Natural Earth Data**
   - URL: https://www.naturalearthdata.com/
   - Coverage: Modern boundaries for reference

3. **Open Historical Map**
   - URL: https://www.openhistoricalmap.org/
   - Coverage: Community-contributed historical data

### Data Processing Pipeline
1. Download raw GeoJSON from authoritative sources
2. Validate and normalize to our schema
3. Assign LOD levels based on feature complexity
4. Store in CDN or API backend
5. Cache with 5-minute TTL for performance

## Performance Optimizations

### Level of Detail (LOD) Strategy
| Level | Zoom Range | Features | Use Case |
|-------|-----------|----------|----------|
| 1 | 0-5 | ~50 | Global view, major empires |
| 2 | 6-7 | ~200 | Regional view, provinces |
| 3 | 8+ | ~500 | Local view, all features |

### Caching
- 5-minute TTL cache per era/LOD combination
- Service Worker support for offline access
- IndexedDB for persistent cache (future)

## Testing

### Mock Data
Run with mock data (default):
```bash
# No API URL configured
npm run dev
```

### Real API
```bash
# With API URL configured
echo "VITE_HISTORY_API_URL=https://api.example.com" > .env
npm run dev
```
