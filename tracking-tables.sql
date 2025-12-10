-- Route Tracking Tables for AEON Optime
-- Run this in your Supabase SQL Editor to add tracking functionality

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
CREATE INDEX IF NOT EXISTS idx_route_tracking_user_id ON route_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_route_tracking_date ON route_tracking(date_driven);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Row Level Security (RLS) - Disabled for anonymous users
ALTER TABLE route_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();