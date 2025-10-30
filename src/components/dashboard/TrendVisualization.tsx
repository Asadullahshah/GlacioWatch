import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RegionData, TrendIndicator } from "@/types/dashboard";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TrendVisualizationProps {
  region: RegionData | null;
  language: 'en' | 'ur';
}

const trendIndicators: TrendIndicator[] = [
  { id: 'rainfall', name: 'Rainfall', nameUr: 'بارش', key: 'rainfall', color: 'hsl(var(--chart-primary))', unit: 'mm', unitUr: 'ملی میٹر' },
  { id: 'temperature', name: 'Temperature', nameUr: 'درجہ حرارت', key: 'temperature', color: 'hsl(var(--chart-secondary))', unit: '°C', unitUr: '°C' },
  { id: 'snowCover', name: 'Snow Cover', nameUr: 'برف کا احاطہ', key: 'snowCover', color: 'hsl(var(--chart-tertiary))', unit: '%', unitUr: '%' },
  { id: 'lakeArea', name: 'Lake Area', nameUr: 'جھیل کا رقبہ', key: 'lakeArea', color: 'hsl(var(--chart-quaternary))', unit: 'km²', unitUr: 'کلومیٹر²' },
];

export function TrendVisualization({ region, language }: TrendVisualizationProps) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['rainfall', 'temperature']);
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const t = {
    en: {
      title: "Historical Trends",
      noRegion: "Select a region to view trends",
      indicators: "Indicators",
      historyMode: "History Replay",
      playback: "Playback",
      speed: "Speed"
    },
    ur: {
      title: "تاریخی رجحانات",
      noRegion: "رجحانات دیکھنے کے لیے کوئی علاقہ منتخب کریں",
      indicators: "اشارے",
      historyMode: "تاریخ کا دوبارہ چلنا",
      playback: "پلے بیک",
      speed: "رفتار"
    }
  };

  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  if (!region) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t[language].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {t[language].noRegion}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t[language].title}
          <div className="flex items-center gap-2">
            <Button
              variant={isHistoryMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsHistoryMode(!isHistoryMode)}
            >
              {isHistoryMode ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {t[language].historyMode}
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Indicator Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t[language].indicators}</h4>
            <div className="flex flex-wrap gap-2">
              {trendIndicators.map((indicator) => (
                <Badge
                  key={indicator.id}
                  variant={selectedIndicators.includes(indicator.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleIndicator(indicator.id)}
                  style={{ 
                    backgroundColor: selectedIndicators.includes(indicator.id) ? indicator.color : undefined,
                    borderColor: indicator.color
                  }}
                >
                  {language === 'en' ? indicator.name : indicator.nameUr}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={region.historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                {selectedIndicators.map((indicatorId) => {
                  const indicator = trendIndicators.find(i => i.id === indicatorId);
                  if (!indicator) return null;
                  
                  return (
                    <Line
                      key={indicatorId}
                      type="monotone"
                      dataKey={indicator.key}
                      stroke={indicator.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: indicator.color }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Playback Controls */}
          {isHistoryMode && (
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {t[language].speed}: {playbackSpeed}x
              </span>
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}