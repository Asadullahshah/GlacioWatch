import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { VideoBackground } from "@/components/VideoBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, TrendingUp, Map, FileText, Waves } from "lucide-react";
import { RegionData } from "@/types/dashboard";
import { HomePage } from "@/components/dashboard/HomePage";
import { HistoricalTrends } from "@/components/dashboard/HistoricalTrends";
import { RegionalMap } from "@/components/dashboard/RegionalMap";
import { ReportsPage } from "@/components/dashboard/ReportsPage";
import { LakeTracker } from "@/components/dashboard/LakeTracker";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const t = {
    en: {
      home: "Home",
      trends: "Historical Trends",
      map: "Regional Map",
      lakeTracker: "Lake Tracker",
      reports: "Reports"
    },
    ur: {
      home: "ہوم",
      trends: "تاریخی رجحانات",
      map: "علاقائی نقشہ",
      lakeTracker: "لیک ٹریکر",
      reports: "رپورٹس"
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <VideoBackground src="/mountain.mp4" overlayOpacity={0.3} />
      
      <DashboardHeader 
        language={language} 
        onLanguageChange={setLanguage}
      />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {t[language].home}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t[language].trends}
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              {t[language].map}
            </TabsTrigger>
            <TabsTrigger value="lake-tracker" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              {t[language].lakeTracker}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t[language].reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomePage 
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              language={language}
            />
          </TabsContent>

          <TabsContent value="trends">
            <HistoricalTrends 
              selectedRegion={selectedRegion}
              language={language}
            />
          </TabsContent>

          <TabsContent value="map">
            <RegionalMap 
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
              language={language}
            />
          </TabsContent>

          <TabsContent value="lake-tracker">
            <LakeTracker 
              language={language}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPage 
              selectedRegion={selectedRegion}
              language={language}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;