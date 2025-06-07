/**
 * AI Service
 * 
 * Core service that integrates OpenAI capabilities with the ModelMemory system
 * to fulfill the user's retention context requirements:
 * - Store last used model (text/image)
 * - Keep last 3 user inputs
 * - Store successful predictions for 1 hour
 * - Remember custom user parameters
 */

import { 
  OpenAIClient, 
  TextGenerationOptions, 
  ImageGenerationOptions
} from './OpenAIClient';
import { 
  ModelMemorySystem, 
  SuccessfulPrediction 
} from '../models/ModelMemory';

export interface AIServiceConfig {
  openAI: {
    apiKey: string;
    organization?: string;
    defaultModels: {
      textGeneration: string;
      imageGeneration: string;
    };
  };
  modelMemory: {
    predictionRetentionSeconds: number;
    recentInputCount: number;
    syncDefaultParameters: boolean;
  };
}

export interface ContentGenerationResult {
  content: string;
  model: string;
  parameters: any;
}

export interface ImageGenerationResult {
  url: string;
  b64_json?: string;
  model: string;
  parameters: any;
}

export class AIService {
  private modelMemorySystem: ModelMemorySystem;
  private openAIClient: OpenAIClient;
  
  constructor(private readonly config: AIServiceConfig) {
    this.modelMemorySystem = new ModelMemorySystem({
      predictionRetentionSeconds: config.modelMemory.predictionRetentionSeconds,
      recentInputCount: config.modelMemory.recentInputCount,
      syncDefaultParameters: config.modelMemory.syncDefaultParameters,
    });
    
    this.openAIClient = new OpenAIClient({
      apiKey: config.openAI.apiKey,
      organization: config.openAI.organization,
      defaultModel: {
        textGeneration: config.openAI.defaultModels.textGeneration,
        imageGeneration: config.openAI.defaultModels.imageGeneration,
      }
    });
  }

  /**
   * Generate text content using OpenAI with model memory integration
   */
  async generateContent(
    userId: string,
    prompt: string,
    options?: TextGenerationOptions,
    context?: string
  ): Promise<ContentGenerationResult> {
    // 1. Check for cached successful prediction within our 1-hour memory window
    const cachedResult = await this.modelMemorySystem.findMatchingPrediction(
      userId,
      prompt,
      context
    );
    
    if (cachedResult) {
      return {
        content: cachedResult.result,
        model: options?.model || this.config.openAI.defaultModels.textGeneration,
        parameters: options || {}
      };
    }
    
    // 2. Get user's preferred model or default
    const userMemory = await this.modelMemorySystem.getUserMemory(userId);
    const model = options?.model || 
                 userMemory?.lastUsedModels.textGeneration || 
                 this.config.openAI.defaultModels.textGeneration;
    
    // 3. Get user's default parameters or system defaults
    const userParameters = userMemory?.defaultParameters.textGeneration || {};
    const parameters = {
      ...userParameters,
      ...options,
      model
    };
    
    // 4. Call OpenAI with appropriate error handling
    try {
      const result = await this.openAIClient.createCompletion(
        prompt,
        parameters
      );
      
      // 5. Store successful prediction for 1 hour (user requirement)
      await this.modelMemorySystem.storeSuccessfulPrediction(
        userId,
        prompt,
        result,
        new Date(Date.now() + (this.config.modelMemory.predictionRetentionSeconds * 1000)),
        context
      );
      
      // 6. Store this input in recent inputs (keep last 3 per user requirement)
      await this.modelMemorySystem.addRecentInput(
        userId,
        prompt,
        context
      );
      
      // 7. Update user's last used model if it changed
      if (model !== userMemory?.lastUsedModels.textGeneration) {
        await this.modelMemorySystem.updatePreferredModel(
          userId,
          'textGeneration',
          model
        );
      }
      
      // 8. Return the result with metadata
      return {
        content: result,
        model,
        parameters
      };
    } catch (error) {
      console.error('AI content generation error:', error);
      throw error;
    }
  }

  /**
   * Generate image using DALL-E with model memory integration
   */
  async generateImage(
    userId: string,
    prompt: string,
    options?: ImageGenerationOptions,
    context?: string
  ): Promise<ImageGenerationResult> {
    // Similar implementation to generateContent, but for image generation
    
    // 1. Get user's preferred model or default
    const userMemory = await this.modelMemorySystem.getUserMemory(userId);
    const model = options?.model || 
                 userMemory?.lastUsedModels.imageGeneration || 
                 this.config.openAI.defaultModels.imageGeneration;
    
    // 2. Get user's default parameters or system defaults
    const userParameters = userMemory?.defaultParameters.imageGeneration || {};
    const parameters = {
      ...userParameters,
      ...options,
      model
    };
    
    // 3. Call OpenAI
    try {
      const result = await this.openAIClient.createImage(
        prompt,
        parameters
      );
      
      // 4. Store this input in recent inputs (keep last 3)
      await this.modelMemorySystem.addRecentInput(
        userId,
        prompt,
        context
      );
      
      // 5. Update user's last used model if it changed
      if (model !== userMemory?.lastUsedModels.imageGeneration) {
        await this.modelMemorySystem.updatePreferredModel(
          userId,
          'imageGeneration',
          model
        );
      }
      
      // 6. Return the result with metadata
      return {
        url: result.url,
        b64_json: result.b64_json,
        model,
        parameters
      };
    } catch (error) {
      console.error('AI image generation error:', error);
      throw error;
    }
  }
  
  /**
   * Get a user's recent inputs to enable autocompletion
   */
  async getUserRecentInputs(userId: string): Promise<string[]> {
    const memory = await this.modelMemorySystem.getUserMemory(userId);
    return memory?.recentInputs.map(input => input.input) || [];
  }
  
  /**
   * Update user's default parameters
   */
  async updateUserDefaultParameters(
    userId: string,
    type: 'textGeneration' | 'imageGeneration',
    parameters: any
  ): Promise<void> {
    await this.modelMemorySystem.updateDefaultParameters(
      userId,
      type,
      parameters
    );
  }
}
