
export interface StartupIdea {
  title: string;
  description: string;
}

export interface BusinessPlan {
  targetAudience: string;
  problem: string;
  solution: string;
  keyFeatures: string;
  monetization: string;
  marketingPlan: string;
}

export type AppView = 'initial' | 'ideas' | 'details';
