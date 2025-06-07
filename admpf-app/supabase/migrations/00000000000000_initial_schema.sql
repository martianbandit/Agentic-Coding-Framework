-- Create schema for app
CREATE SCHEMA IF NOT EXISTS public;

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';
ALTER DATABASE postgres SET "app.jwt_exp" TO 3600;

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create a secure function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    
    -- Also create initial model memory entries
    INSERT INTO public.user_model_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- MODEL MEMORY SYSTEM TABLES
-- These tables implement the retention context requirements:
-- 1. Store last used model (text/image)
-- 2. Store last 3 inputs for autocompletion
-- 3. Cache successful predictions for 1 hour
-- 4. Remember user parameter preferences

-- User model preferences table
CREATE TABLE IF NOT EXISTS public.user_model_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    last_text_model VARCHAR NOT NULL DEFAULT 'gpt-4o',
    last_image_model VARCHAR NOT NULL DEFAULT 'dall-e-3',
    text_parameters JSONB NOT NULL DEFAULT '{"temperature": 0.7, "maxTokens": 2000, "topP": 1, "frequencyPenalty": 0, "presencePenalty": 0}'::jsonb,
    image_parameters JSONB NOT NULL DEFAULT '{"resolution": "1024x1024", "style": "natural", "quality": "standard"}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    CONSTRAINT user_model_preferences_user_id_key UNIQUE (user_id)
);

-- Recent user inputs table (limited to 3 per user per context)
CREATE TABLE IF NOT EXISTS public.user_recent_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    input_text TEXT NOT NULL,
    context VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Index for efficient retrieval by user and context
CREATE INDEX IF NOT EXISTS user_recent_inputs_user_id_context_idx 
    ON public.user_recent_inputs(user_id, context, created_at DESC);

-- Successful predictions cache table (entries expire after 1 hour)
CREATE TABLE IF NOT EXISTS public.prediction_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prompt_hash VARCHAR NOT NULL,
    prompt_text TEXT NOT NULL,
    result_text TEXT NOT NULL,
    context VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for efficient prediction retrieval and cleanup
CREATE INDEX IF NOT EXISTS prediction_cache_user_id_prompt_hash_idx 
    ON public.prediction_cache(user_id, prompt_hash);
CREATE INDEX IF NOT EXISTS prediction_cache_expires_at_idx 
    ON public.prediction_cache(expires_at);

-- STORAGE MANAGEMENT
-- For digital products and assets

-- Product table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'draft',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables that need updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Ensure users can only access their own data

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User model preferences RLS
ALTER TABLE public.user_model_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON public.user_model_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.user_model_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Recent inputs RLS
ALTER TABLE public.user_recent_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inputs"
    ON public.user_recent_inputs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inputs"
    ON public.user_recent_inputs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Prediction cache RLS
ALTER TABLE public.prediction_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own predictions"
    ON public.prediction_cache FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions"
    ON public.prediction_cache FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own products"
    ON public.products FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
    ON public.products FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
    ON public.products FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
    ON public.products FOR DELETE
    USING (auth.uid() = user_id);
