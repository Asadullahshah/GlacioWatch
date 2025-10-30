import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendVisualization } from "./TrendVisualization";
import { RegionData } from "@/types/dashboard";

interface HistoricalTrendsProps {
  selectedRegion: RegionData | null;
  language: 'en' | 'ur';
}

export function HistoricalTrends({ selectedRegion, language }: HistoricalTrendsProps) {
  const t = {
    en: {
      title: "Historical Trends Analysis",
      description: "Select a region from the Home tab to view detailed historical trends and patterns",
      noData: "No region selected"
    },
    ur: {
      title: "تاریخی رجحانات کا تجزیہ",
      description: "تفصیلی تاریخی رجحانات اور پیٹرن دیکھنے کے لیے ہوم ٹیب سے کوئی علاقہ منتخب کریں",
      noData: "کوئی علاقہ منتخب نہیں"
    }
  };

  if (!selectedRegion) {
    return (
      <Card className="h-[60vh] flex items-center justify-center">
        <CardContent className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {t[language].noData}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t[language].description}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t[language].title}</h2>
        <p className="text-muted-foreground">
          {language === 'en' ? selectedRegion.name : selectedRegion.nameUr}
        </p>
      </div>
      
      <TrendVisualization 
        region={selectedRegion}
        language={language}
      />
    </div>
  );
}