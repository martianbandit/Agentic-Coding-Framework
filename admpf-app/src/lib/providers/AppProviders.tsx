/**
 * Application Providers
 * 
 * This file centralizes all context providers for the application
 * ensuring proper nesting order and dependency management.
 */

'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ModelMemoryProvider } from '../contexts/ModelMemoryContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ModelMemoryProvider>
        {children}
      </ModelMemoryProvider>
    </AuthProvider>
  );
}
