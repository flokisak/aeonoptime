// Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://sgrvxuepflnxhhwxkqkz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncnZ4dWVwZmxueGhod3hrcWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjgyMzYsImV4cCI6MjA4MDk0NDIzNn0.lHmwYOaBXU3lwRZrLbhvbPVDC0nZUT4nJpzSUnwQchg';

// Initialize Supabase immediately
if (typeof window !== 'undefined') {
    try {
        if (window.supabase && window.supabase.createClient) {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseReady = true;
            console.log('Supabase client initialized successfully');
        } else {
            console.error('Supabase library not loaded - createClient not available');
            window.supabaseReady = false;
        }
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        window.supabaseReady = false;
    }
}
