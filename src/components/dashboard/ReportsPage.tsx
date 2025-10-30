import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportsPanel } from "./ReportsPanel";
import { RegionData } from "@/types/dashboard";
import { mockRegions } from "@/data/mockData";
import { Download, FileText, Calendar, Users } from "lucide-react";

interface ReportsPageProps {
  selectedRegion: RegionData | null;
  language: 'en' | 'ur';
}

export function ReportsPage({ selectedRegion, language }: ReportsPageProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const t = {
    en: {
      title: "Reports & Analytics",
      generate: "Generate Report",
      download: "Download",
      allRegions: "All Regions Summary",
      dailyReport: "Daily Risk Report",
      weeklyReport: "Weekly Analysis",
      monthlyReport: "Monthly Trends",
      customReport: "Custom Date Range",
      generating: "Generating...",
      lastUpdated: "Last updated"
    },
    ur: {
      title: "رپورٹس اور تجزیات",
      generate: "رپورٹ بنائیں",
      download: "ڈاؤن لوڈ",
      allRegions: "تمام علاقوں کا خلاصہ",
      dailyReport: "یومیہ خطرے کی رپورٹ",
      weeklyReport: "ہفتہ وار تجزیہ",
      monthlyReport: "ماہانہ رجحانات",
      customReport: "مخصوص تاریخ کی رینج",
      generating: "بنایا جا رہا ہے...",
      lastUpdated: "آخری بار اپ ڈیٹ"
    }
  };

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // In a real app, this would trigger actual report generation and download
    console.log(`Generating ${type} report for region:`, selectedRegion?.name || 'All Regions');
  };

  const reportTypes = [
    {
      id: 'daily',
      title: t[language].dailyReport,
      icon: FileText,
      description: 'Current risk levels and immediate forecasts'
    },
    {
      id: 'weekly',
      title: t[language].weeklyReport,
      icon: Calendar,
      description: '7-day trend analysis and patterns'
    },
    {
      id: 'monthly',
      title: t[language].monthlyReport,
      icon: Users,
      description: 'Comprehensive monthly climate trends'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t[language].title}</h2>
        <p className="text-muted-foreground">
          {selectedRegion 
            ? (language === 'en' ? selectedRegion.name : selectedRegion.nameUr)
            : t[language].allRegions
          }
        </p>
      </div>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" />
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGenerating ? t[language].generating : t[language].generate}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Region Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Risk Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRegions.map((region) => (
                <div key={region.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? region.name : region.nameUr}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score: {region.currentRisk.score}/100
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    region.currentRisk.level === 'low' 
                      ? 'bg-green-100 text-green-800'
                      : region.currentRisk.level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {region.currentRisk.level.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports Panel */}
        <ReportsPanel 
          region={selectedRegion}
          language={language}
        />
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Daily Risk Assessment', date: '2024-01-19', type: 'PDF' },
              { name: 'Weekly Climate Trends', date: '2024-01-15', type: 'PDF' },
              { name: 'Monthly Analysis', date: '2024-01-01', type: 'PDF' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t[language].lastUpdated}: {report.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t[language].download}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}