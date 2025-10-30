export interface RegionData {
  id: string;
  name: string;
  nameUr: string;
  coordinates: [number, number];
  currentRisk: RiskLevel;
  forecast: ForecastData[];
  explainability: ExplainabilityData;
  historicalData: HistoricalDataPoint[];
}

export interface RiskLevel {
  level: 'low' | 'medium' | 'high';
  score: number;
  description: string;
  descriptionUr: string;
}

export interface ForecastData {
  date: string;
  risk: RiskLevel;
  confidence: number;
}

export interface ExplainabilityData {
  rainfall: number;
  temperatureAnomaly: number;
  snowCoverDecline: number;
  lakeGrowth: number;
}

export interface HistoricalDataPoint {
  date: string;
  rainfall: number;
  temperature: number;
  snowCover: number;
  lakeArea: number;
  riskScore: number;
}

export interface TrendIndicator {
  id: string;
  name: string;
  nameUr: string;
  key: keyof Omit<HistoricalDataPoint, 'date'>;
  color: string;
  unit: string;
  unitUr: string;
}

export interface Language {
  code: 'en' | 'ur';
  name: string;
  nativeName: string;
}