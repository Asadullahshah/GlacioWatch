import { Globe, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardHeaderProps {
  language: 'en' | 'ur';
  onLanguageChange: (language: 'en' | 'ur') => void;
}

export function DashboardHeader({ language, onLanguageChange }: DashboardHeaderProps) {
  const t = {
    en: {
      title: "Climate Risk Dashboard",
      subtitle: "Real-time risk assessment and forecasting",
      lastUpdate: "Last updated: 2 hours ago",
      language: "Language"
    },
    ur: {
      title: "آب و ہوا کے خطرات کا ڈیش بورڈ",
      subtitle: "حقیقی وقت میں خطرے کا جائزہ اور پیشن گوئی",
      lastUpdate: "آخری بار اپ ڈیٹ: 2 گھنٹے پہلے",
      language: "زبان"
    }
  };

  return (
    <header className="bg-card shadow-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t[language].title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t[language].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {t[language].lastUpdate}
            </Badge>

            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ur">اردو</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}