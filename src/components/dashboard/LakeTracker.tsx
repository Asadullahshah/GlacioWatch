import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Satellite, Map as MapIcon, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgNDBMMjIuMiAyMC44QzI0LjEgMTcuNyAyNC4xIDEzLjcgMjIuMiAxMC42QzIwLjMgNy41IDE2LjggNS41IDEyLjUgNS41QzguMiA1LjUgNC43IDcuNSAyLjggMTAuNkMwLjkgMTMuNyAwLjkgMTcuNyAyLjggMjAuOEwxMi41IDQwWiIgZmlsbD0iIzEwN0VGRiIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTUuNSIgcj0iNi41IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgNDBMMjIuMiAyMC44QzI0LjEgMTcuNyAyNC4xIDEzLjcgMjIuMiAxMC42QzIwLjMgNy41IDE2LjggNS41IDEyLjUgNS41QzguMiA1LjUgNC7IDcuNSAyLjggMTAuNkMwLjkgMTMuNyAwLjkgMTcuNyAyLjggMjAuOEwxMi41IDQwWiIgZmlsbD0iIzEwN0VGRiIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTUuNSIgcj0iNi41IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMjAuNSIgcnk9IjMuNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPgo=',
});

interface LakeTrackerProps {
  language: 'en' | 'ur';
}

// Mock data for lake area over time
const mockLakeData = [
  { date: '2020-01', area: 2.1 },
  { date: '2020-07', area: 2.3 },
  { date: '2021-01', area: 2.4 },
  { date: '2021-07', area: 2.7 },
  { date: '2022-01', area: 2.8 },
  { date: '2022-07', area: 3.1 },
  { date: '2023-01', area: 3.2 },
  { date: '2023-07', area: 3.6 },
  { date: '2024-01', area: 3.8 },
  { date: '2024-07', area: 4.1 },
];

const lakeOptions = [
  { id: 'attabad', name: 'Attabad Lake', nameUr: 'عطا آباد جھیل', coords: [36.3, 74.8] as [number, number] },
  { id: 'shishper', name: 'Shishper Lake', nameUr: 'شش پر جھیل', coords: [36.4, 74.6] as [number, number] },
  { id: 'passu', name: 'Passu Lake', nameUr: 'پاسو جھیل', coords: [36.5, 74.9] as [number, number] },
  { id: 'borith', name: 'Borith Lake', nameUr: 'بورتھ جھیل', coords: [36.4, 74.7] as [number, number] },
];

export function LakeTracker({ language }: LakeTrackerProps) {
  const [selectedLake, setSelectedLake] = useState(lakeOptions[0].id);
  const [viewMode, setViewMode] = useState<'satellite' | 'segmentation'>('satellite');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const t = {
    en: {
      title: "Glacial Lake Size Tracker",
      selectLake: "Select Lake",
      satelliteView: "Satellite View",
      segmentationView: "Segmentation Overlay",
      lakeArea: "Lake Area (km²)",
      exportReport: "Export Report",
      insights: "Insights",
      growthTrend: "Lake growth trend: Increasing steadily",
      riskLevel: "Risk level: Medium",
      currentArea: "Current Area",
      areaChange: "Area Change (1 year)",
    },
    ur: {
      title: "برفانی جھیل کا سائز ٹریکر",
      selectLake: "جھیل منتخب کریں",
      satelliteView: "سیٹلائٹ ویو",
      segmentationView: "سیگمینٹیشن اوورلے",
      lakeArea: "جھیل کا رقبہ (کلومیٹر²)",
      exportReport: "رپورٹ ایکسپورٹ کریں",
      insights: "بصیرت",
      growthTrend: "جھیل کی نمو کا رجحان: مستقل طور پر بڑھ رہا ہے",
      riskLevel: "خطرے کی سطح: درمیانی",
      currentArea: "موجودہ رقبہ",
      areaChange: "رقبے میں تبدیلی (1 سال)",
    }
  };

  const selectedLakeData = lakeOptions.find(lake => lake.id === selectedLake) || lakeOptions[0];
  const currentArea = mockLakeData[mockLakeData.length - 1].area;
  const previousYearArea = mockLakeData[mockLakeData.length - 3].area;
  const areaChange = currentArea - previousYearArea;
  const percentageChange = ((areaChange / previousYearArea) * 100).toFixed(1);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(selectedLakeData.coords, 12);

    // Add tile layer based on view mode
    const tileUrl = viewMode === 'satellite' 
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: viewMode === 'satellite' 
        ? '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        : '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Add lake boundary (mock polygon)
    const lakePolygon = L.polygon([
      [selectedLakeData.coords[0] + 0.01, selectedLakeData.coords[1] - 0.01],
      [selectedLakeData.coords[0] + 0.01, selectedLakeData.coords[1] + 0.01],
      [selectedLakeData.coords[0] - 0.01, selectedLakeData.coords[1] + 0.01],
      [selectedLakeData.coords[0] - 0.01, selectedLakeData.coords[1] - 0.01]
    ], {
      color: '#0ea5e9',
      fillColor: '#0ea5e9',
      fillOpacity: 0.3,
      weight: 2
    }).addTo(mapInstance.current);

    // Add lake marker
    const marker = L.marker(selectedLakeData.coords).addTo(mapInstance.current);
    marker.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
          ${language === 'en' ? selectedLakeData.name : selectedLakeData.nameUr}
        </h3>
        <p style="margin: 0; font-size: 12px;">
          Area: ${currentArea} km²
        </p>
      </div>
    `);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [selectedLake, viewMode, language, selectedLakeData, currentArea]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t[language].title}</h2>
        <div className="flex gap-2">
          <Select value={selectedLake} onValueChange={setSelectedLake}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t[language].selectLake} />
            </SelectTrigger>
            <SelectContent>
              {lakeOptions.map((lake) => (
                <SelectItem key={lake.id} value={lake.id}>
                  {language === 'en' ? lake.name : lake.nameUr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            {t[language].exportReport}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {language === 'en' ? selectedLakeData.name : selectedLakeData.nameUr}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('satellite')}
                >
                  <Satellite className="h-4 w-4 mr-1" />
                  {t[language].satelliteView}
                </Button>
                <Button
                  variant={viewMode === 'segmentation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('segmentation')}
                >
                  <MapIcon className="h-4 w-4 mr-1" />
                  {t[language].segmentationView}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mapRef} 
              className="w-full h-[400px] rounded-b-lg"
            />
          </CardContent>
        </Card>

        {/* Graph and Insights Panel */}
        <div className="space-y-6">
          {/* Time Series Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t[language].lakeArea}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockLakeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      label={{ value: 'Area (km²)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="area" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t[language].insights}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t[language].currentArea}</p>
                  <p className="text-2xl font-bold text-primary">{currentArea} km²</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t[language].areaChange}</p>
                  <div className="flex items-center gap-2">
                    {areaChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-success" />
                    )}
                    <p className="text-2xl font-bold text-destructive">
                      +{areaChange.toFixed(1)} km²
                    </p>
                    <Badge variant="destructive" className="ml-1">
                      +{percentageChange}%
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <p className="text-sm">{t[language].growthTrend}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Medium Risk
                  </Badge>
                  <p className="text-sm">{t[language].riskLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}