/**
 * OpenAI Client wrapper
 * 
 * Provides a simplified interface for accessing OpenAI's API services
 * with proper error handling and retry logic
 */

import OpenAI from 'openai';

export interface OpenAIClientConfig {
  apiKey: string;
  organization?: string;
  defaultModel: {
    textGeneration: string;
    imageGeneration: string;
  };
  maxRetries?: number;
}

export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ImageGenerationOptions {
  model?: string;
  resolution?: string; // e.g. "1024x1024"
  style?: string; // e.g. "natural", "vivid"
  quality?: string; // e.g. "standard", "hd"
}

export class OpenAIClient {
  private client: OpenAI;
  private config: OpenAIClientConfig;

  constructor(config: OpenAIClientConfig) {
    this.config = {
      ...config,
      maxRetries: config.maxRetries || 3,
      defaultModel: {
        textGeneration: config.defaultModel?.textGeneration || 'gpt-4o',
        imageGeneration: config.defaultModel?.imageGeneration || 'dall-e-3',
      }
    };

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organization,
      maxRetries: this.config.maxRetries,
    });
  }

  /**
   * Generate text using OpenAI's text completion API
   */
  async createCompletion(
    prompt: string,
    options?: TextGenerationOptions
  ): Promise<string> {
    try {
      const model = options?.model || this.config.defaultModel.textGeneration;
      
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        top_p: options?.topP ?? 1,
        frequency_penalty: options?.frequencyPenalty ?? 0,
        presence_penalty: options?.presencePenalty ?? 0,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI completion error:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Generate an image using DALL-E
   */
  async createImage(
    prompt: string,
    options?: ImageGenerationOptions
  ): Promise<{ url: string; b64_json?: string }> {
    try {
      const model = options?.model || this.config.defaultModel.imageGeneration;
      
      const response = await this.client.images.generate({
        model: model,
        prompt: prompt,
        n: 1,
        size: options?.resolution || '1024x1024',
        style: (options?.style as any) || 'natural',
        quality: (options?.quality as any) || 'standard',
        response_format: 'url',
      });

      return { 
        url: response.data[0].url || '',
        b64_json: response.data[0].b64_json
      };
    } catch (error) {
      console.error('OpenAI image generation error:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle OpenAI API errors with appropriate messaging and retry logic
   */
  private handleError(error: any): void {
    // Check if it's a rate limit error
    if (error?.status === 429) {
      console.warn('OpenAI rate limit exceeded. Please try again later.');
    }
    
    // Check if it's an authentication error
    if (error?.status === 401) {
      console.error('OpenAI authentication failed. Please check your API key.');
    }

    // Check if it's a server error
    if (error?.status >= 500) {
      console.error('OpenAI server error. The service might be experiencing issues.');
    }
  }
}
