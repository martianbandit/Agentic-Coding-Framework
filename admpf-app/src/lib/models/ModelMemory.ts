/**
 * Model Memory System
 * 
 * Implements the user retention context requirements:
 * - Store last used model (text/image generation)
 * - Retain last 3 user inputs for autocompletion
 * - Keep successful predictions for 1 hour for quick reuse
 * - Remember user's customized default parameters
 */

export interface ModelMemoryConfig {
  // Duration to store successful predictions (default: 3600 seconds = 1 hour)
  predictionRetentionSeconds: number;
  // Number of recent inputs to store (default: 3)
  recentInputCount: number;
  // Whether to sync default parameters to user profile
  syncDefaultParameters: boolean;
}

export interface RecentInput {
  timestamp: Date;
  input: string;
  context: string;
}

export interface SuccessfulPrediction {
  id: string;
  prompt: string;
  result: string;
  context: string;
  timestamp: Date;
  expiresAt: Date; // 1 hour from creation
}

export interface ModelParameters {
  textGeneration: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  imageGeneration: {
    resolution: string; // e.g. "1024x1024"
    style: string; // e.g. "natural", "vivid"
    quality: string; // e.g. "standard", "hd"
  };
}

export interface ModelMemory {
  userId: string;
  lastUsedModels: {
    textGeneration: string; // e.g. "gpt-4o"
    imageGeneration: string; // e.g. "dall-e-3"
  };
  recentInputs: RecentInput[];
  successfulPredictions: SuccessfulPrediction[];
  defaultParameters: ModelParameters;
}

export class ModelMemorySystem {
  private config: ModelMemoryConfig;
  
  constructor(config?: Partial<ModelMemoryConfig>) {
    this.config = {
      predictionRetentionSeconds: config?.predictionRetentionSeconds || 3600, // 1 hour default
      recentInputCount: config?.recentInputCount || 3, // Last 3 inputs
      syncDefaultParameters: config?.syncDefaultParameters ?? true,
    };
  }
  
  /**
   * Retrieve user's model memory from the database
   */
  async getUserMemory(userId: string): Promise<ModelMemory | null> {
    // This will be implemented when we add Supabase integration
    // For now, return mock data
    return this.getMockMemory(userId);
  }
  
  /**
   * Find a matching prediction in the user's memory
   */
  async findMatchingPrediction(
    userId: string,
    prompt: string,
    context?: string
  ): Promise<SuccessfulPrediction | null> {
    // This would query the database to find a matching prediction
    // For now, return null (no match)
    return null;
  }
  
  /**
   * Store a successful prediction for future reuse
   */
  async storeSuccessfulPrediction(
    userId: string,
    prompt: string,
    result: string, 
    expiresAt: Date,
    context?: string
  ): Promise<void> {
    // This would store the prediction in the database
    // For now, just log to console
    console.log(`Storing prediction for user ${userId}: ${prompt.substring(0, 30)}...`);
  }
  
  /**
   * Add a recent user input to the memory system
   * Will keep only the latest N inputs (default: 3)
   */
  async addRecentInput(
    userId: string,
    input: string,
    context?: string
  ): Promise<void> {
    // This would store the recent input in the database
    // For now, just log to console
    console.log(`Adding recent input for user ${userId}: ${input.substring(0, 30)}...`);
  }
  
  /**
   * Update user's preferred models
   */
  async updatePreferredModel(
    userId: string,
    type: 'textGeneration' | 'imageGeneration',
    modelName: string
  ): Promise<void> {
    // This would update the user's preferred model in the database
    // For now, just log to console
    console.log(`Setting ${type} model for user ${userId} to ${modelName}`);
  }
  
  /**
   * Update user's default parameters
   */
  async updateDefaultParameters(
    userId: string,
    type: 'textGeneration' | 'imageGeneration',
    parameters: any
  ): Promise<void> {
    // This would update the user's default parameters in the database
    // For now, just log to console
    console.log(`Updating ${type} parameters for user ${userId}`);
  }
  
  /**
   * Clean up expired predictions
   */
  async cleanupExpiredPredictions(): Promise<void> {
    // This would delete expired predictions from the database
    // Would be run periodically via a cron job
    console.log('Cleaning up expired predictions');
  }
  
  /**
   * Helper to generate mock memory for development
   */
  private getMockMemory(userId: string): ModelMemory {
    return {
      userId,
      lastUsedModels: {
        textGeneration: 'gpt-4o',
        imageGeneration: 'dall-e-3'
      },
      recentInputs: [
        {
          timestamp: new Date(),
          input: 'Generate content for a landing page about digital products',
          context: 'content-generation'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          input: 'Create an image of a modern e-commerce dashboard',
          context: 'image-generation'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          input: 'Generate product description for a digital marketing course',
          context: 'content-generation'
        }
      ],
      successfulPredictions: [
        {
          id: '123',
          prompt: 'Generate content for a landing page about digital products',
          result: 'Transform your ideas into profitable digital products...',
          context: 'content-generation',
          timestamp: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now
        }
      ],
      defaultParameters: {
        textGeneration: {
          temperature: 0.7,
          maxTokens: 2000,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0
        },
        imageGeneration: {
          resolution: '1024x1024',
          style: 'natural',
          quality: 'standard'
        }
      }
    };
  }
}
