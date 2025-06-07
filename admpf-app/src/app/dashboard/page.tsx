'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useModelMemory } from '@/lib/contexts/ModelMemoryContext';
import { AIService } from '@/lib/services/AIService';
import { RecentInput } from '@/lib/models/ModelMemory';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    lastTextModel, 
    lastImageModel, 
    recentInputs, 
    textParameters,
    imageParameters,
    addRecentInput,
    getMatchingPrediction,
    storePrediction,
    updateLastTextModel,
    updateLastImageModel, 
    loading: modelMemoryLoading 
  } = useModelMemory();
  
  // Project state
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Content generation state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationType, setGenerationType] = useState<'text' | 'image'>('text');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cachingStatus, setCachingStatus] = useState<'new' | 'cached' | null>(null);

  useEffect(() => {
    // Redirect unauthenticated users
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // Load user data
    if (user && !modelMemoryLoading) {
      setIsLoading(false);
      
      // Here we would load user projects from Supabase
      // For now, just using mock data
      setProjects([
        { id: '1', name: 'Digital Marketing Guide', type: 'ebook', status: 'draft' },
        { id: '2', name: 'Social Media Templates', type: 'graphics', status: 'published' },
        { id: '3', name: 'Productivity Planner', type: 'printable', status: 'draft' }
      ]);
    }
  }, [authLoading, modelMemoryLoading, user, router]);

  // Handle user sign out
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  // AIService instance
  const aiService = new AIService();

  // Handle content generation
  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;
    
    setIsGenerating(true);
    setCachingStatus(null);
    
    // Check if we have a cached prediction for this prompt
    const cachedPrediction = getMatchingPrediction(prompt, generationType);
    
    if (cachedPrediction) {
      // Use cached prediction
      setGeneratedContent(cachedPrediction.result);
      setIsGenerating(false);
      setCachingStatus('cached');
    } else {
      try {
        let result: string;
        
        if (generationType === 'text') {
          // Generate text using AIService
          result = await aiService.generateText(prompt, lastTextModel || 'gpt-4o');
        } else {
          // Generate image using AIService
          const imageUrl = await aiService.generateImage(prompt, lastImageModel || 'dall-e-3');
          result = imageUrl;
        }
        
        setGeneratedContent(result);
        setIsGenerating(false);
        setCachingStatus('new');
        
        // Store in model memory context
        storePrediction(prompt, result, generationType);
        addRecentInput(prompt, generationType);
      } catch (error) {
        console.error('Error generating content:', error);
        setGeneratedContent(`Error: ${error instanceof Error ? error.message : 'Failed to generate content'}`);  
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  // Use a recent input as prompt
  const useRecentInput = (input: RecentInput) => {
    setPrompt(input.input);
    setShowSuggestions(false);
  };
  
  // Toggle between text and image generation
  const toggleGenerationType = () => {
    setGenerationType((prev: 'text' | 'image') => prev === 'text' ? 'image' : 'text');
    setGeneratedContent('');
    setCachingStatus(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ADMPF Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Projects</h2>
                <button
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  New Project
                </button>
              </div>
              
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">No projects yet. Create your first one!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="capitalize text-gray-600 dark:text-gray-300">{project.type}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                project.status === 'published' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                                {project.status === 'published' ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
            
            {/* Content Generation Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Generate</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <button
                    onClick={toggleGenerationType}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${generationType === 'text' ? 'bg-indigo-600' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                  >
                    Text
                  </button>
                  <button
                    onClick={toggleGenerationType}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${generationType === 'image' ? 'bg-indigo-600' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                  >
                    Image
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Input area */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="generation-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {generationType === 'text' ? 'What content would you like to create?' : 'Describe the image you want'}
                    </label>
                    {recentInputs && recentInputs.length > 0 && (
                      <button 
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        {showSuggestions ? 'Hide Recent Inputs' : 'Show Recent Inputs'}
                      </button>
                    )}
                  </div>
                  
                  {showSuggestions && recentInputs && recentInputs.length > 0 && (
                    <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent inputs:</p>
                      <ul className="space-y-1">
                        {recentInputs.map((input: RecentInput, idx: number) => (
                          <li key={idx}>
                            <button 
                              onClick={() => useRecentInput(input)}
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 truncate max-w-full text-left"
                            >
                              {input.input}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="relative">
                    <textarea
                      id="generation-prompt"
                      rows={3}
                      value={prompt}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder={`Describe what you'd like to generate...`}
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${isGenerating || !prompt.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : 'Generate'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Results area */}
                {generatedContent && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Generated {generationType === 'text' ? 'Content' : 'Image'}
                      </h3>
                      {cachingStatus && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cachingStatus === 'cached' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                          {cachingStatus === 'cached' ? '✓ From Cache' : 'Newly Generated'}
                        </span>
                      )}
                    </div>
                    
                    {generationType === 'text' ? (
                      <div className="whitespace-pre-wrap rounded p-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                        {generatedContent}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <img 
                          src={generatedContent as string} 
                          alt="Generated Image" 
                          className="max-w-full rounded shadow-md"  
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = 'https://via.placeholder.com/512x512.png?text=Image+Loading+Error';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Model Memory Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Model Memory</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                  Auto-Retention Active
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Text Generation Model */}
                <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Text Generation Model</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{lastTextModel || 'gpt-4o'}</span>
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Remembered</span>
                    </div>
                    <div className="relative">
                      <select 
                        className="appearance-none bg-transparent text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 pr-6 cursor-pointer" 
                        value={lastTextModel || 'gpt-4o'}
                        onChange={(e) => updateLastTextModel(e.target.value)}
                      >
                        <option value="gpt-4o">gpt-4o</option>
                        <option value="gpt-4-turbo">gpt-4-turbo</option>
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image Generation Model */}
                <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Image Generation Model</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{lastImageModel || 'dall-e-3'}</span>
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Remembered</span>
                    </div>
                    <div className="relative">
                      <select 
                        className="appearance-none bg-transparent text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 pr-6 cursor-pointer" 
                        value={lastImageModel || 'dall-e-3'}
                        onChange={(e) => updateLastImageModel(e.target.value)}
                      >
                        <option value="dall-e-3">dall-e-3</option>
                        <option value="dall-e-2">dall-e-2</option>
                        <option value="stable-diffusion-3">stable-diffusion-3</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Inputs - showing last 3 as per retention rules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Inputs</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last 3 retained</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {recentInputs && recentInputs.length > 0 ? (
                      recentInputs.map((input: RecentInput, index: number) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-start">
                          <span className="text-xs text-gray-400 mr-2">•</span>
                          <span className="truncate">{input.input}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No recent inputs
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Prediction Cache Status - showing 1 hour retention */}
                <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-700 p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Prediction Cache</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Successful predictions stored for 1 hour
                  </p>
                </div>
              </div>
            </section>
            
            {/* Quick Stats */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Published</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {projects.filter(p => p.status === 'published').length}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Generations</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">$0</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
