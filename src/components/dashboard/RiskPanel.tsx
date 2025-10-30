import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react";
import { RegionData } from "@/types/dashboard";

interface RiskPanelProps {
  region: RegionData | null;
  language: 'en' | 'ur';
}

export function RiskPanel({ region, language }: RiskPanelProps) {
  const t = {
    en: {
      title: "Risk Assessment",
      noRegion: "Select a region to view risk details",
      currentRisk: "Current Risk Level",
      forecast: "5-Day Forecast",
      explainability: "Risk Factors",
      confidence: "Confidence",
      factors: {
        rainfall: "Rainfall",
        temperatureAnomaly: "Temperature Anomaly",
        snowCoverDecline: "Snow Cover Decline",
        lakeGrowth: "Lake Growth"
      }
    },
    ur: {
      title: "خطرے کا جائزہ",
      noRegion: "خطرے کی تفصیلات دیکھنے کے لیے کوئی علاقہ منتخب کریں",
      currentRisk: "موجودہ خطرے کی سطح",
      forecast: "5 دنوں کی پیشن گوئی",
      explainability: "خطرے کے عوامل",
      confidence: "اعتماد",
      factors: {
        rainfall: "بارش",
        temperatureAnomaly: "درجہ حرارت میں تبدیلی",
        snowCoverDecline: "برف کی کمی",
        lakeGrowth: "جھیل کا پھیلاؤ"
      }
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      default: return <TrendingDown className="h-4 w-4" />;
    }
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
    <div className="space-y-4">
      {/* Current Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon(region.currentRisk.level)}
            {t[language].currentRisk}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {language === 'en' ? region.name : region.nameUr}
              </span>
              <Badge 
                variant={getRiskBadgeVariant(region.currentRisk.level)}
                className="capitalize"
              >
                {region.currentRisk.level}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Score</span>
                <span>{region.currentRisk.score}/100</span>
              </div>
              <Progress value={region.currentRisk.score} className="h-2" />
            </div>
            
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? region.currentRisk.description : region.currentRisk.descriptionUr}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t[language].forecast}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {region.forecast.map((forecast, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  {new Date(forecast.date).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getRiskBadgeVariant(forecast.risk.level)}
                    className="text-xs"
                  >
                    {forecast.risk.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {forecast.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>{t[language].explainability}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(region.explainability).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t[language].factors[key as keyof typeof t.en.factors]}</span>
                  <span className={value > 0 ? "text-red-600" : "text-green-600"}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(value)} 
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}