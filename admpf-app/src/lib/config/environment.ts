/**
 * Environment configuration
 * 
 * Centralizes all application configuration with appropriate defaults
 * for AI model retention context requirements:
 * - Store last used model (ex: gpt-4o, dall-e-3)
 * - Keep last 3 user inputs for autocompletion
 * - Store successful predictions for 1 hour for quick reuse
 * - Remember user's default parameter preferences
 */

export const config = {
  openAI: {
    apiKey: process.env.OPENAI_API_KEY || '',
    organization: process.env.OPENAI_ORGANIZATION,
    defaultModels: {
      textGeneration: process.env.DEFAULT_TEXT_MODEL || 'gpt-4o',
      imageGeneration: process.env.DEFAULT_IMAGE_MODEL || 'dall-e-3'
    },
    defaultParameters: {
      textGeneration: {
        temperature: parseFloat(process.env.DEFAULT_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.DEFAULT_MAX_TOKENS || '2000', 10),
        topP: parseFloat(process.env.DEFAULT_TOP_P || '1'),
        frequencyPenalty: parseFloat(process.env.DEFAULT_FREQUENCY_PENALTY || '0'),
        presencePenalty: parseFloat(process.env.DEFAULT_PRESENCE_PENALTY || '0')
      },
      imageGeneration: {
        resolution: process.env.DEFAULT_IMAGE_RESOLUTION || '1024x1024',
        style: process.env.DEFAULT_IMAGE_STYLE || 'natural',
        quality: process.env.DEFAULT_IMAGE_QUALITY || 'standard'
      }
    }
  },
  modelMemory: {
    // Keep successful predictions for exactly 1 hour as specified in requirements
    predictionRetentionSeconds: parseInt(
      process.env.MODEL_MEMORY_STORAGE_DURATION || '3600', 10
    ),
    // Store exactly 3 recent user inputs as specified in requirements
    recentInputCount: parseInt(
      process.env.USER_INPUTS_HISTORY_COUNT || '3', 10
    ),
    syncDefaultParameters: process.env.STORE_DEFAULT_PARAMETERS === 'true' || true
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  }
}
