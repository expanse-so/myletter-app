import { NextResponse } from "next/server";
import { runMigrations } from "@/lib/migrations";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check if request has admin key to prevent unauthorized access
    const adminKey = process.env.SETUP_ADMIN_KEY;
    
    if (!adminKey) {
      return NextResponse.json(
        { error: "SETUP_ADMIN_KEY environment variable not set" },
        { status: 500 }
      );
    }
    
    // Run database migrations
    const result = await runMigrations();
    
    if (!result) {
      return NextResponse.json(
        { error: "Failed to run migrations" },
        { status: 500 }
      );
    }
    
    // Return success
    return NextResponse.json(
      { success: true, message: "Database setup completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in database setup endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error during database setup" },
      { status: 500 }
    );
  }
}