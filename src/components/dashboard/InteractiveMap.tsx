import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegionData } from "@/types/dashboard";
import { mockRegions } from "@/data/mockData";

interface InteractiveMapProps {
  onRegionSelect: (region: RegionData) => void;
  selectedRegion: RegionData | null;
  language: 'en' | 'ur';
}

export function InteractiveMap({ onRegionSelect, selectedRegion, language }: InteractiveMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const t = {
    en: {
      title: "Regional Risk Map",
      clickRegion: "Click on a region to view details"
    },
    ur: {
      title: "علاقائی خطرے کا نقشہ",
      clickRegion: "تفصیلات دیکھنے کے لیے کسی علاقے پر کلک کریں"
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'hsl(var(--risk-low))';
      case 'medium': return 'hsl(var(--risk-medium))';
      case 'high': return 'hsl(var(--risk-high))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t[language].title}
          <div className="flex gap-2">
            <Badge className="bg-risk-low-bg text-risk-low-foreground">Low</Badge>
            <Badge className="bg-risk-medium-bg text-risk-medium-foreground">Medium</Badge>
            <Badge className="bg-risk-high-bg text-risk-high-foreground">High</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 min-h-[400px]">
          {/* Simplified SVG Map */}
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full"
            style={{ maxHeight: '400px' }}
          >
            {/* Background water bodies */}
            <rect width="800" height="500" fill="hsl(var(--map-water))" opacity="0.3" />
            
            {/* Mock regions */}
            {mockRegions.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              const isHovered = hoveredRegion === region.id;
              
              return (
                <g key={region.id}>
                  {/* Region shape - simplified as circles for demo */}
                  <circle
                    cx={region.coordinates[0] * 8}
                    cy={region.coordinates[1] * 5}
                    r={isSelected ? 35 : isHovered ? 30 : 25}
                    fill={getRiskColor(region.currentRisk.level)}
                    stroke={isSelected ? "hsl(var(--primary))" : "white"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onRegionSelect(region)}
                    opacity={0.8}
                  />
                  
                  {/* Region label */}
                  <text
                    x={region.coordinates[0] * 8}
                    y={region.coordinates[1] * 5 + 50}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground"
                    pointerEvents="none"
                  >
                    {language === 'en' ? region.name : region.nameUr}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Instruction text */}
          <p className="text-center text-muted-foreground text-sm mt-4">
            {t[language].clickRegion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}