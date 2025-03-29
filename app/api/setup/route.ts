import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    // Check for authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    const setupToken = process.env.SETUP_ADMIN_KEY;
    
    if (!setupToken || token !== setupToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 403 }
      );
    }
    
    // Get service role client
    const supabase = getServiceSupabase();
    
    // Check if profiles table exists
    const { data, error } = await supabase.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');
    
    if (error) {
      return NextResponse.json(
        { error: "Error checking database schema" },
        { status: 500 }
      );
    }
    
    // If the profiles table doesn't exist, create it
    if (!data || data.length === 0) {
      // Create profiles table using raw SQL
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
      `);
      
      if (createError) {
        return NextResponse.json(
          { error: "Error creating profiles table", details: createError },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: true, message: "Created profiles table" },
        { status: 200 }
      );
    }
    
    // Table already exists
    return NextResponse.json(
      { success: true, message: "Profiles table already exists" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in database setup endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}