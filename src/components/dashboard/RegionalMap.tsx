import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegionData } from "@/types/dashboard";
import { mockRegions } from "@/data/mockData";
import { Satellite, Map as MapIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgNDBMMjIuMiAyMC44QzI0LjEgMTcuNyAyNC4xIDEzLjcgMjIuMiAxMC42QzIwLjMgNy41IDE2LjggNS41IDEyLjUgNS41QzguMiA1LjUgNC43IDcuNSAyLjggMTAuNkMwLjkgMTMuNyAwLjkgMTcuNyAyLjggMjAuOEwxMi41IDQwWiIgZmlsbD0iIzEwN0VGRiIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTUuNSIgcj0iNi41IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgNDBMMjIuMiAyMC44QzI0LjEgMTcuNyAyNC4xIDEzLjcgMjIuMiAxMC42QzIwLjMgNy41IDE2LjggNS41IDEyLjUgNS41QzguMiA1LjUgNC43IDcuNSAyLjggMTAuNkMwLjkgMTMuNyAwLjkgMTcuNyAyLjggMjAuOEwxMi41IDQwWiIgZmlsbD0iIzEwN0VGRiIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTUuNSIgcj0iNi41IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMjAuNSIgcnk9IjMuNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPgo=',
});

interface RegionalMapProps {
  onRegionSelect: (region: RegionData) => void;
  selectedRegion: RegionData | null;
  language: 'en' | 'ur';
}

export function RegionalMap({ onRegionSelect, selectedRegion, language }: RegionalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [viewMode, setViewMode] = useState<'satellite' | 'standard'>('standard');

  const t = {
    en: {
      title: "Regional Risk Map",
      clickRegion: "Click on markers to view region details",
      satelliteView: "Satellite View",
      standardView: "Standard View"
    },
    ur: {
      title: "علاقائی خطرے کا نقشہ",
      clickRegion: "علاقے کی تفصیلات دیکھنے کے لیے مارکرز پر کلک کریں",
      satelliteView: "سیٹلائٹ ویو",
      standardView: "معیاری ویو"
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (region: RegionData) => {
    const color = getRiskColor(region.currentRisk.level);
    const isSelected = selectedRegion?.id === region.id;
    const size = isSelected ? 35 : 25;
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 30 ? '12px' : '10px'};
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          ${region.currentRisk.score}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([36.0, 73.0], 6);

    // Add tile layer based on view mode
    const tileUrl = viewMode === 'satellite' 
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = viewMode === 'satellite'
      ? '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      : '© OpenStreetMap contributors';

    L.tileLayer(tileUrl, {
      attribution: attribution
    }).addTo(mapInstance.current);

    // Add markers for each region
    mockRegions.forEach((region) => {
      // Convert our mock coordinates to actual lat/lng for Pakistan regions
      const coords = getRegionCoordinates(region.id);
      
      const marker = L.marker(coords, {
        icon: createCustomIcon(region)
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            ${language === 'en' ? region.name : region.nameUr}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="
              background: ${getRiskColor(region.currentRisk.level)};
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              text-transform: uppercase;
            ">
              ${region.currentRisk.level} Risk
            </span>
          </div>
          <p style="margin: 0; font-size: 12px; line-height: 1.4;">
            Score: ${region.currentRisk.score}/100
          </p>
        </div>
      `);

      marker.on('click', () => {
        onRegionSelect(region);
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [onRegionSelect, language, viewMode]);

  // Update markers when selection changes or view mode changes
  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Clear existing layers and re-add tile layer
    mapInstance.current.eachLayer((layer) => {
      mapInstance.current!.removeLayer(layer);
    });

    // Re-add tile layer based on current view mode
    const tileUrl = viewMode === 'satellite' 
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = viewMode === 'satellite'
      ? '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      : '© OpenStreetMap contributors';

    L.tileLayer(tileUrl, {
      attribution: attribution
    }).addTo(mapInstance.current);

    // Re-add markers
    mockRegions.forEach((region) => {
      const coords = getRegionCoordinates(region.id);
      
      const marker = L.marker(coords, {
        icon: createCustomIcon(region)
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            ${language === 'en' ? region.name : region.nameUr}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="
              background: ${getRiskColor(region.currentRisk.level)};
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              text-transform: uppercase;
            ">
              ${region.currentRisk.level} Risk
            </span>
          </div>
          <p style="margin: 0; font-size: 12px; line-height: 1.4;">
            Score: ${region.currentRisk.score}/100
          </p>
        </div>
      `);

      marker.on('click', () => {
        onRegionSelect(region);
      });
    });
  }, [selectedRegion, onRegionSelect, language, viewMode]);

  // Convert region IDs to actual Pakistan coordinates
  const getRegionCoordinates = (regionId: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'gilgit': [35.9, 74.3],
      'chitral': [35.8, 71.8],
      'hunza': [36.3, 74.6],
      'skardu': [35.3, 75.6]
    };
    return coordinates[regionId] || [36.0, 73.0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t[language].title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t[language].clickRegion}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('standard')}
            >
              <MapIcon className="h-4 w-4 mr-1" />
              {t[language].standardView}
            </Button>
            <Button
              variant={viewMode === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('satellite')}
            >
              <Satellite className="h-4 w-4 mr-1" />
              {t[language].satelliteView}
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>
            <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            className="w-full h-[70vh] rounded-lg"
            style={{ minHeight: '500px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}