import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskPanel } from "./RiskPanel";
import { RegionData } from "@/types/dashboard";
import { mockRegions } from "@/data/mockData";

interface HomePageProps {
  selectedRegion: RegionData | null;
  onRegionSelect: (region: RegionData) => void;
  language: 'en' | 'ur';
}

export function HomePage({ selectedRegion, onRegionSelect, language }: HomePageProps) {
  const t = {
    en: {
      title: "Climate Risk Dashboard",
      selectRegion: "Select Region",
      currentRisk: "Current Risk Status",
      allRegions: "All Regions Overview"
    },
    ur: {
      title: "آب و ہوا کے خطرے کا ڈیش بورڈ",
      selectRegion: "علاقہ منتخب کریں",
      currentRisk: "موجودہ خطرے کی صورتحال",
      allRegions: "تمام علاقوں کا جائزہ"
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <Card>
        <CardHeader>
          <CardTitle>{t[language].selectRegion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockRegions.map((region) => (
              <Button
                key={region.id}
                variant={selectedRegion?.id === region.id ? "default" : "outline"}
                onClick={() => onRegionSelect(region)}
                className={`h-auto p-4 flex flex-col items-center gap-2 hover:bg-[#A1EF8B]/90 bg-[#C9F0FF] ${
                  selectedRegion?.id === region.id ? 'bg-[#D4B483] text-primary-foreground ' : ''
                }`}
              >
                <span className="font-medium text-sm">
                  {language === 'en' ? region.name : region.nameUr}
                </span>
                <Badge variant={getRiskBadgeVariant(region.currentRisk.level)}>
                  {region.currentRisk.level.toUpperCase()}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-risk-low-bg/10 border-risk-low">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-risk-low-foreground">Low Risk Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low-foreground">
              {mockRegions.filter(r => r.currentRisk.level === 'low').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-risk-medium-bg/10 border-risk-medium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-risk-medium-foreground">Medium Risk Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium-foreground">
              {mockRegions.filter(r => r.currentRisk.level === 'medium').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-risk-high-bg/10 border-risk-high">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-risk-high-foreground">High Risk Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high-foreground">
              {mockRegions.filter(r => r.currentRisk.level === 'high').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Details */}
      {selectedRegion && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskPanel region={selectedRegion} language={language} />
          
          {/* Risk Factors Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(selectedRegion.explainability).map(([factor, value]) => (
                <div key={factor} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`text-sm font-medium ${value > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {value > 0 ? '+' : ''}{value}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        value > 0 ? 'bg-destructive' : 'bg-muted-foreground/30'
                      }`}
                      style={{ width: `${Math.abs(value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}