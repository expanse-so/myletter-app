import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly in this file to avoid circular dependencies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Schema for validating the request body
const subscribeSchema = z.object({
  newsletter_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request data',
        details: validation.error.errors
      }, { status: 400 });
    }
    
    const { newsletter_id, email, name } = validation.data;
    
    // Check if the user is already subscribed
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('newsletter_id', newsletter_id)
      .eq('email', email)
      .single();
      
    if (existingSubscriber) {
      // User is already subscribed
      return NextResponse.json({ 
        success: true, 
        data: existingSubscriber,
        message: 'Already subscribed' 
      });
    }
    
    // Add the new subscriber
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        {
          newsletter_id,
          email,
          name: name || null,
          status: 'active',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('Error subscribing:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to subscribe' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Successfully subscribed'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error'
    }, { status: 500 });
  }
}