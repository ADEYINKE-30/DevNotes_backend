export interface AIChatRequest {
  message: string;
  conversationId?: string;
  tutorialId?: string;
  lessonId?: string;
}

export interface AIChatResponse {
  response: string;
  conversationId: string;
}

export interface AIRecommendation {
  tutorial: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    slug: string;
  };
  reason: string;
  score: number;
}

export interface AIRecommendationsResponse {
  recommendations: AIRecommendation[];
}
