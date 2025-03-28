import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Define validation schema
const subscriptionSchema = z.object({
  newsletter_id: z.string().min(1, 'Newsletter ID is required'),
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const validationResult = subscriptionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields or invalid data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }
    
    const { newsletter_id, email, name } = validationResult.data;
    
    // Insert subscriber to database
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        newsletter_id,
        email,
        name: name || null,
        status: 'active',
      })
      .select()
      .single();
    
    if (error) {
      // Check for duplicate subscription
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Email already subscribed' },
          { status: 409 }
        );
      }
      
      console.error('Error subscribing:', error);
      
      return NextResponse.json(
        { success: false, error: `Error subscribing: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}