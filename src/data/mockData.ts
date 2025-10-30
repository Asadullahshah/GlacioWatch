import { RegionData } from "@/types/dashboard";

export const mockRegions: RegionData[] = [
  {
    id: "gilgit",
    name: "Gilgit-Baltistan",
    nameUr: "گلگت بلتستان",
    coordinates: [50, 35],
    currentRisk: {
      level: "high",
      score: 78,
      description: "High risk due to rapid glacial lake expansion and increased rainfall",
      descriptionUr: "برفانی جھیل کے تیزی سے پھیلنے اور بارش میں اضافے کی وجہ سے زیادہ خطرہ"
    },
    forecast: [
      { date: "2024-01-20", risk: { level: "high", score: 80, description: "", descriptionUr: "" }, confidence: 85 },
      { date: "2024-01-21", risk: { level: "high", score: 75, description: "", descriptionUr: "" }, confidence: 82 },
      { date: "2024-01-22", risk: { level: "medium", score: 65, description: "", descriptionUr: "" }, confidence: 78 },
      { date: "2024-01-23", risk: { level: "medium", score: 60, description: "", descriptionUr: "" }, confidence: 75 },
      { date: "2024-01-24", risk: { level: "medium", score: 55, description: "", descriptionUr: "" }, confidence: 72 },
    ],
    explainability: {
      rainfall: 25,
      temperatureAnomaly: 15,
      snowCoverDecline: 10,
      lakeGrowth: 20
    },
    historicalData: generateHistoricalData("2024-01-01", 90)
  },
  {
    id: "chitral",
    name: "Chitral",
    nameUr: "چترال",
    coordinates: [70, 45],
    currentRisk: {
      level: "medium",
      score: 55,
      description: "Moderate risk with increasing temperature anomalies",
      descriptionUr: "درجہ حرارت میں تبدیلی کے ساتھ درمیانہ خطرہ"
    },
    forecast: [
      { date: "2024-01-20", risk: { level: "medium", score: 58, description: "", descriptionUr: "" }, confidence: 80 },
      { date: "2024-01-21", risk: { level: "medium", score: 62, description: "", descriptionUr: "" }, confidence: 75 },
      { date: "2024-01-22", risk: { level: "low", score: 45, description: "", descriptionUr: "" }, confidence: 70 },
      { date: "2024-01-23", risk: { level: "low", score: 40, description: "", descriptionUr: "" }, confidence: 68 },
      { date: "2024-01-24", risk: { level: "low", score: 35, description: "", descriptionUr: "" }, confidence: 65 },
    ],
    explainability: {
      rainfall: 5,
      temperatureAnomaly: 20,
      snowCoverDecline: 15,
      lakeGrowth: 8
    },
    historicalData: generateHistoricalData("2024-01-01", 90)
  },
  {
    id: "hunza",
    name: "Hunza Valley",
    nameUr: "وادی ہنزہ",
    coordinates: [85, 25],
    currentRisk: {
      level: "low",
      score: 35,
      description: "Low risk with stable conditions",
      descriptionUr: "مستحکم حالات کے ساتھ کم خطرہ"
    },
    forecast: [
      { date: "2024-01-20", risk: { level: "low", score: 38, description: "", descriptionUr: "" }, confidence: 90 },
      { date: "2024-01-21", risk: { level: "low", score: 40, description: "", descriptionUr: "" }, confidence: 88 },
      { date: "2024-01-22", risk: { level: "medium", score: 50, description: "", descriptionUr: "" }, confidence: 85 },
      { date: "2024-01-23", risk: { level: "medium", score: 55, description: "", descriptionUr: "" }, confidence: 82 },
      { date: "2024-01-24", risk: { level: "medium", score: 58, description: "", descriptionUr: "" }, confidence: 80 },
    ],
    explainability: {
      rainfall: -5,
      temperatureAnomaly: 8,
      snowCoverDecline: 5,
      lakeGrowth: 2
    },
    historicalData: generateHistoricalData("2024-01-01", 90)
  },
  {
    id: "skardu",
    name: "Skardu",
    nameUr: "سکردو",
    coordinates: [60, 60],
    currentRisk: {
      level: "high",
      score: 82,
      description: "Very high risk due to multiple glacial lakes",
      descriptionUr: "متعدد برفانی جھیلوں کی وجہ سے بہت زیادہ خطرہ"
    },
    forecast: [
      { date: "2024-01-20", risk: { level: "high", score: 85, description: "", descriptionUr: "" }, confidence: 92 },
      { date: "2024-01-21", risk: { level: "high", score: 80, description: "", descriptionUr: "" }, confidence: 90 },
      { date: "2024-01-22", risk: { level: "high", score: 75, description: "", descriptionUr: "" }, confidence: 87 },
      { date: "2024-01-23", risk: { level: "medium", score: 68, description: "", descriptionUr: "" }, confidence: 85 },
      { date: "2024-01-24", risk: { level: "medium", score: 62, description: "", descriptionUr: "" }, confidence: 83 },
    ],
    explainability: {
      rainfall: 30,
      temperatureAnomaly: 12,
      snowCoverDecline: 18,
      lakeGrowth: 25
    },
    historicalData: generateHistoricalData("2024-01-01", 90)
  }
];

function generateHistoricalData(startDate: string, days: number) {
  const data = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    
    // Generate realistic but random data
    const rainfall = Math.max(0, 50 + Math.sin(i * 0.1) * 30 + Math.random() * 20);
    const temperature = 15 + Math.sin(i * 0.05) * 10 + Math.random() * 5;
    const snowCover = Math.max(0, Math.min(100, 70 - i * 0.3 + Math.random() * 15));
    const lakeArea = 500 + i * 0.5 + Math.random() * 10;
    const riskScore = Math.max(0, Math.min(100, 
      (rainfall > 60 ? 20 : 0) + 
      (temperature > 20 ? 15 : 0) + 
      (snowCover < 50 ? 20 : 0) + 
      (lakeArea > 520 ? 25 : 0) +
      Math.random() * 20
    ));
    
    data.push({
      date: date.toISOString().split('T')[0],
      rainfall: Math.round(rainfall * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      snowCover: Math.round(snowCover * 10) / 10,
      lakeArea: Math.round(lakeArea * 10) / 10,
      riskScore: Math.round(riskScore)
    });
  }
  
  return data;
}