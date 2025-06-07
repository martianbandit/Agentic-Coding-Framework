/**
 * Model Memory Context
 * 
 * Manages user's model memory state and persistence with Supabase
 * Implements retention requirements:
 * - Store last used model (gpt-4o, dall-e-3)
 * - Keep last 3 user inputs
 * - Store successful predictions for 1 hour
 * - Remember default parameters
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseClient } from '../services/SupabaseClient';
import { ModelMemory, RecentInput, SuccessfulPrediction } from '../models/ModelMemory';

interface ModelMemoryContextType {
  // Last used models and preferences
  lastTextModel: string;
  lastImageModel: string;
  textParameters: any;
  imageParameters: any;
  
  // Recent inputs (limit to 3)
  recentInputs: RecentInput[];
  
  // Successful predictions cache (1 hour retention)
  getMatchingPrediction: (prompt: string, context?: string) => Promise<SuccessfulPrediction | null>;
  
  // Update methods
  updateLastTextModel: (model: string) => Promise<void>;
  updateLastImageModel: (model: string) => Promise<void>;
  updateTextParameters: (params: any) => Promise<void>;
  updateImageParameters: (params: any) => Promise<void>;
  addRecentInput: (input: string, context?: string) => Promise<void>;
  storePrediction: (prompt: string, result: string, context?: string) => Promise<void>;
  
  // Loading state
  loading: boolean;
}

const ModelMemoryContext = createContext<ModelMemoryContextType | undefined>(undefined);

export function ModelMemoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  
  // Model memory state
  const [lastTextModel, setLastTextModel] = useState<string>('gpt-4o');
  const [lastImageModel, setLastImageModel] = useState<string>('dall-e-3');
  const [textParameters, setTextParameters] = useState<any>({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const [imageParameters, setImageParameters] = useState<any>({
    resolution: '1024x1024',
    style: 'natural',
    quality: 'standard'
  });
  
  const [recentInputs, setRecentInputs] = useState<RecentInput[]>([]);

  // Load user preferences when auth state changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const loadUserPreferences = async () => {
      try {
        setLoading(true);
        
        // Load model preferences
        const { data: preferences, error: preferencesError } = await supabaseClient
          .from('user_model_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (preferencesError) {
          console.error('Error loading user preferences:', preferencesError);
        } else if (preferences) {
          setLastTextModel(preferences.last_text_model);
          setLastImageModel(preferences.last_image_model);
          setTextParameters(preferences.text_parameters);
          setImageParameters(preferences.image_parameters);
        }
        
        // Load recent inputs (limit to 3)
        const { data: inputs, error: inputsError } = await supabaseClient
          .from('user_recent_inputs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (inputsError) {
          console.error('Error loading recent inputs:', inputsError);
        } else if (inputs) {
          setRecentInputs(inputs.map(input => ({
            timestamp: new Date(input.created_at),
            input: input.input_text,
            context: input.context
          })));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadUserPreferences();
  }, [user]);
  
  // Update the last used text generation model
  const updateLastTextModel = async (model: string) => {
    if (!user) return;
    
    setLastTextModel(model);
    
    // Update in Supabase
    const { error } = await supabaseClient
      .from('user_model_preferences')
      .update({ last_text_model: model })
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error updating text model preference:', error);
    }
  };
  
  // Update the last used image generation model
  const updateLastImageModel = async (model: string) => {
    if (!user) return;
    
    setLastImageModel(model);
    
    // Update in Supabase
    const { error } = await supabaseClient
      .from('user_model_preferences')
      .update({ last_image_model: model })
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error updating image model preference:', error);
    }
  };
  
  // Update text generation parameters
  const updateTextParameters = async (params: any) => {
    if (!user) return;
    
    setTextParameters(params);
    
    // Update in Supabase
    const { error } = await supabaseClient
      .from('user_model_preferences')
      .update({ text_parameters: params })
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error updating text parameters:', error);
    }
  };
  
  // Update image generation parameters
  const updateImageParameters = async (params: any) => {
    if (!user) return;
    
    setImageParameters(params);
    
    // Update in Supabase
    const { error } = await supabaseClient
      .from('user_model_preferences')
      .update({ image_parameters: params })
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error updating image parameters:', error);
    }
  };
  
  // Add a recent user input
  // Keeps only the latest 3 inputs as specified in requirements
  const addRecentInput = async (input: string, context: string = 'general') => {
    if (!user) return;
    
    // Add to Supabase
    const { error } = await supabaseClient
      .from('user_recent_inputs')
      .insert({
        user_id: user.id,
        input_text: input,
        context
      });
      
    if (error) {
      console.error('Error adding recent input:', error);
      return;
    }
    
    // Update local state
    const newInput: RecentInput = {
      timestamp: new Date(),
      input,
      context
    };
    
    // Limit to 3 inputs
    const updatedInputs = [newInput, ...recentInputs].slice(0, 3);
    setRecentInputs(updatedInputs);
    
    // Delete old inputs to maintain only 3 in database
    if (recentInputs.length >= 3) {
      // Get all inputs and delete excess
      const { data: allInputs } = await supabaseClient
        .from('user_recent_inputs')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (allInputs && allInputs.length > 3) {
        // Get IDs to delete (everything after the first 3)
        const inputsToDelete = allInputs.slice(3).map(input => input.id);
        
        // Delete excess inputs
        await supabaseClient
          .from('user_recent_inputs')
          .delete()
          .in('id', inputsToDelete);
      }
    }
  };
  
  // Store a successful prediction with 1-hour expiry
  const storePrediction = async (
    prompt: string, 
    result: string, 
    context: string = 'general'
  ) => {
    if (!user) return;
    
    // Calculate hash for faster lookup
    const promptHash = btoa(prompt).substring(0, 50);
    
    // Set expiry time to exactly 1 hour from now (as per requirements)
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    
    // Store in Supabase
    const { error } = await supabaseClient
      .from('prediction_cache')
      .insert({
        user_id: user.id,
        prompt_hash: promptHash,
        prompt_text: prompt,
        result_text: result,
        context,
        expires_at: expiresAt.toISOString()
      });
      
    if (error) {
      console.error('Error storing prediction:', error);
    }
  };
  
  // Get a matching prediction if it exists
  const getMatchingPrediction = async (
    prompt: string,
    context: string = 'general'
  ): Promise<SuccessfulPrediction | null> => {
    if (!user) return null;
    
    // Calculate hash for faster lookup
    const promptHash = btoa(prompt).substring(0, 50);
    
    // Try exact match first
    const { data, error } = await supabaseClient
      .from('prediction_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('prompt_hash', promptHash)
      .eq('context', context)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      prompt: data.prompt_text,
      result: data.result_text,
      context: data.context,
      timestamp: new Date(data.created_at),
      expiresAt: new Date(data.expires_at)
    };
  };

  const value = {
    lastTextModel,
    lastImageModel,
    textParameters,
    imageParameters,
    recentInputs,
    getMatchingPrediction,
    updateLastTextModel,
    updateLastImageModel,
    updateTextParameters,
    updateImageParameters,
    addRecentInput,
    storePrediction,
    loading
  };

  return (
    <ModelMemoryContext.Provider value={value}>
      {children}
    </ModelMemoryContext.Provider>
  );
}

export const useModelMemory = () => {
  const context = useContext(ModelMemoryContext);
  if (context === undefined) {
    throw new Error('useModelMemory must be used within a ModelMemoryProvider');
  }
  return context;
};
