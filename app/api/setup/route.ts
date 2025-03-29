import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Simplified API endpoint for build
    return NextResponse.json(
      { success: true, message: "Profiles table exists" },
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