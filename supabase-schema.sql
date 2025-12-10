-- Supabase Database Schema for AEON Optime Route Optimizer
-- Run this in your Supabase SQL Editor

-- Routes table for storing saved routes
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'anonymous', -- For anonymous users, use a generated ID
  name TEXT NOT NULL,
  stops JSONB NOT NULL, -- Array of stop objects with address, lat, lng, priority, timeLimit
  starting_point JSONB, -- Starting point object with address, lat, lng
  round_trip BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE, -- Allow sharing/public routes
  share_token TEXT UNIQUE, -- For sharing routes without authentication
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route usage tracking (optional analytics)
CREATE TABLE IF NOT EXISTS route_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  user_id TEXT DEFAULT 'anonymous',
  action TEXT NOT NULL, -- 'load', 'save', 'share', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route tracking for distance and earnings calculation
CREATE TABLE IF NOT EXISTS route_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  user_id TEXT DEFAULT 'anonymous',
  distance_driven DECIMAL(10,2), -- km driven
  distance_planned DECIMAL(10,2), -- planned route distance
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  date_driven DATE NOT NULL DEFAULT CURRENT_DATE,
  earnings DECIMAL(10,2), -- calculated earnings
  km_rate DECIMAL(5,2) DEFAULT 3.00, -- CZK per km
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings for tracking preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE DEFAULT 'anonymous',
  km_rate DECIMAL(5,2) DEFAULT 3.00, -- CZK per km
  currency TEXT DEFAULT 'CZK',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_share_token ON routes(share_token);
CREATE INDEX IF NOT EXISTS idx_routes_created_at ON routes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_route_usage_route_id ON route_usage(route_id);
CREATE INDEX IF NOT EXISTS idx_route_tracking_user_id ON route_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_route_tracking_date ON route_tracking(date_driven);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Row Level Security (RLS) - Disabled for anonymous users
-- For this demo app, we'll handle security at the application level
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(6), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();