// Configuration for AI models
export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'google';
  contextLength: number;
  costTier: 'low' | 'medium' | 'high';
}

export const availableModels: AIModelConfig[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    contextLength: 128000,
    costTier: 'low',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    contextLength: 128000,
    costTier: 'medium',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    contextLength: 30000,
    costTier: 'medium',
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    provider: 'google',
    contextLength: 128000,
    costTier: 'high',
  },
];

// Get model configuration by ID
export function getModelConfig(modelId: string): AIModelConfig | undefined {
  return availableModels.find(model => model.id === modelId);
}

// Get available models for a specific provider
export function getProviderModels(provider: 'openai' | 'google'): AIModelConfig[] {
  return availableModels.filter(model => model.provider === provider);
}

// System prompts for different use cases
export const systemPrompts = {
  newsletter: `You are an AI writing assistant helping a user write their newsletter. 
  Be helpful, concise, and creative. When asked to modify content, provide specific 
  changes to make. When asked to generate new content, provide complete sections 
  ready to be inserted.`,
  
  contentImprovement: `You are analyzing newsletter content and suggesting improvements.
  Focus on clarity, engagement, and readability. Provide specific, actionable suggestions
  that can be directly applied to the content.`,
  
  ideaGeneration: `You are a creative assistant helping brainstorm newsletter content ideas.
  Generate unique, engaging topic ideas based on the user's audience and interests.`,
};