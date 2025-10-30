import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Share } from "lucide-react";
import { RegionData } from "@/types/dashboard";

interface ReportsPanelProps {
  region: RegionData | null;
  language: 'en' | 'ur';
}

export function ReportsPanel({ region, language }: ReportsPanelProps) {
  const t = {
    en: {
      title: "Reports & Export",
      dailyReport: "Daily Risk Report",
      weeklyReport: "Weekly Analysis",
      customReport: "Custom Report",
      downloadPdf: "Download PDF",
      downloadCsv: "Download CSV",
      share: "Share Report",
      lastGenerated: "Last generated",
      generateNew: "Generate New Report",
      regions: "regions"
    },
    ur: {
      title: "رپورٹس اور ایکسپورٹ",
      dailyReport: "روزانہ خطرے کی رپورٹ",
      weeklyReport: "ہفتہ وار تجزیہ",
      customReport: "حسب ضرورت رپورٹ",
      downloadPdf: "پی ڈی ایف ڈاؤن لوڈ کریں",
      downloadCsv: "سی ایس وی ڈاؤن لوڈ کریں",
      share: "رپورٹ شیئر کریں",
      lastGenerated: "آخری بار بنایا گیا",
      generateNew: "نئی رپورٹ بنائیں",
      regions: "علاقے"
    }
  };

  const reportTypes = [
    {
      id: 'daily',
      title: t[language].dailyReport,
      description: region ? `${language === 'en' ? region.name : region.nameUr} - Today` : 'Current region',
      lastGenerated: '2 hours ago',
      icon: Calendar
    },
    {
      id: 'weekly',
      title: t[language].weeklyReport,
      description: `5 ${t[language].regions} - This week`,
      lastGenerated: '1 day ago',
      icon: FileText
    },
    {
      id: 'custom',
      title: t[language].customReport,
      description: 'Custom date range and metrics',
      lastGenerated: '3 days ago',
      icon: Download
    }
  ];

  const handleDownload = (format: 'pdf' | 'csv', reportType: string) => {
    // Mock download functionality
    console.log(`Downloading ${reportType} report as ${format}`);
    // In a real app, this would trigger the actual download
  };

  const handleShare = (reportType: string) => {
    // Mock share functionality
    console.log(`Sharing ${reportType} report`);
    // In a real app, this would open share options
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {t[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <div key={report.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {t[language].lastGenerated}: {report.lastGenerated}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload('pdf', report.id)}
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload('csv', report.id)}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(report.id)}
                  >
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}

          <Button className="w-full" variant="default">
            <FileText className="h-4 w-4 mr-2" />
            {t[language].generateNew}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}