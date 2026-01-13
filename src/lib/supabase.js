import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://utwgbktjsmewbknowweo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0d2dia3Rqc21ld2Jrbm93d2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTczNTQsImV4cCI6MjA4Mzg3MzM1NH0.bzetqC2CWhqX4VRbWm4Ycq3fztYNU63EYeWyJJmENXE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)