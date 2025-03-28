import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Subscriber } from '@/types/database';

// Schema for validating the GET query parameters
const getQuerySchema = z.object({
  newsletter_id: z.string().uuid().optional(),
  status: z.enum(['active', 'unsubscribed', 'pending']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

// Schema for validating the POST request body
const postBodySchema = z.object({
  newsletter_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  status: z.enum(['active', 'unsubscribed', 'pending']).default('active'),
});

// Schema for validating the DELETE request body
const deleteBodySchema = z.object({
  id: z.string().uuid(),
});

// Schema for validating the PATCH request body
const patchBodySchema = z.object({
  id: z.string().uuid(),
  newsletter_id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  status: z.enum(['active', 'unsubscribed', 'pending']).optional(),
});

// GET: List subscribers with optional filtering
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    
    // Validate parameters
    const validation = getQuerySchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }
    
    const { newsletter_id, status, search, page, limit } = validation.data;
    
    // Start building the query
    let query = supabase
      .from('subscribers')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (newsletter_id) {
      query = query.eq('newsletter_id', newsletter_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Execute the query
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // Return the data with pagination info
    return NextResponse.json({ 
      data, 
      meta: {
        total: count,
        page,
        limit,
        total_pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new subscriber
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validation = postBodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }
    
    const subscriberData = validation.data;
    
    // Check if subscriber with this email already exists in this newsletter
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', subscriberData.email)
      .eq('newsletter_id', subscriberData.newsletter_id)
      .single();
    
    if (existingSubscriber) {
      return NextResponse.json({ error: 'Subscriber already exists' }, { status: 409 });
    }
    
    // Insert the new subscriber
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        {
          newsletter_id: subscriberData.newsletter_id,
          email: subscriberData.email,
          name: subscriberData.name,
          status: subscriberData.status,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove a subscriber
export async function DELETE(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validation = deleteBodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }
    
    const { id } = validation.data;
    
    // Delete the subscriber
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update a subscriber
export async function PATCH(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validation = patchBodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }
    
    const { id, ...updateData } = validation.data;
    
    // Update the subscriber
    const { data, error } = await supabase
      .from('subscribers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}