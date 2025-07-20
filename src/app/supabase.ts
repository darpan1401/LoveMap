// src/app/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nulfxtselcyfezdbrtqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bGZ4dHNlbGN5ZmV6ZGJydHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODE3MjIsImV4cCI6MjA2ODM1NzcyMn0.lwuuHX2ud4_lMGBxguaOfCPYftH4kj6qMcO4A8LImu4';

export const supabase = createClient(supabaseUrl, supabaseKey);
