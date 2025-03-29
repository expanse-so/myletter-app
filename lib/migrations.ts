import { supabase } from './supabase';

/**
 * Ensures that the profiles table exists in the database
 * This should be called when the app starts to make sure the required tables exist
 */
export async function ensureProfilesTableExists() {
  try {
    // Check if the profiles table exists
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');
    
    if (tablesError) {
      console.error('Error checking for profiles table:', tablesError);
      return false;
    }

    // If the table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      const { error: createError } = await supabase.rpc('create_profiles_table');
      
      if (createError) {
        console.error('Error creating profiles table:', createError);
        
        // Fall back to manual SQL if the RPC function doesn't exist
        const { error: sqlError } = await supabase.query(`
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
        `);
        
        if (sqlError) {
          console.error('Error creating profiles table with SQL:', sqlError);
          return false;
        }
      }
      
      console.log('Created profiles table successfully');
    } else {
      console.log('Profiles table already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring profiles table exists:', error);
    return false;
  }
}

/**
 * Run all database migrations needed for the app
 */
export async function runMigrations() {
  console.log('Running database migrations...');
  await ensureProfilesTableExists();
  // Add other migration functions here as needed
  console.log('Database migrations completed');
}