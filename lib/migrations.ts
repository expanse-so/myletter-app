import { createClient } from '@supabase/supabase-js'

// Direct method to run migrations - avoiding circular dependencies
export async function runMigrations() {
  try {
    console.log('Running database migrations...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables not set')
      return false
    }
    
    // Create a supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if the profiles table exists
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles')
    
    if (tablesError) {
      console.error('Error checking for profiles table:', tablesError)
      return false
    }
    
    // If the table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      const { error: createError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          updated_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own profile"
          ON profiles FOR SELECT
          USING (auth.uid() = id);
          
        CREATE POLICY "Users can update their own profile"
          ON profiles FOR UPDATE
          USING (auth.uid() = id);
          
        CREATE POLICY "Users can insert their own profile"
          ON profiles FOR INSERT
          WITH CHECK (auth.uid() = id);
      `)
      
      if (createError) {
        console.error('Error creating profiles table:', createError)
        return false
      }
      
      console.log('Created profiles table successfully')
    } else {
      console.log('Profiles table already exists')
    }
    
    console.log('Database migrations completed')
    return true
  } catch (error) {
    console.error('Unexpected error ensuring profiles table exists:', error)
    return false
  }
}