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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_share_token ON routes(share_token);
CREATE INDEX IF NOT EXISTS idx_routes_created_at ON routes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_route_usage_route_id ON route_usage(route_id);

-- Row Level Security (RLS) - Disabled for anonymous users
-- For this demo app, we'll handle security at the application level
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_usage DISABLE ROW LEVEL SECURITY;

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