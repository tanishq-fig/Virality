export interface ViralityScore {
  overall: number;
  emotionalImpact: number;
  shareability: number;
  timing: number;
  uniqueness: number;
  engagement: number;
}

export interface AnalysisResult {
  content: string;
  score: ViralityScore;
  insights: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
