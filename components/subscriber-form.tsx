'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly in this component to avoid circular dependencies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SubscriberFormProps {
  newsletterId: string;
  onSuccess?: (data: any) => void;
  title?: string;
  description?: string;
}

export function SubscriberForm({
  newsletterId,
  onSuccess,
  title = 'Subscribe to our newsletter',
  description = 'Get the latest updates and news delivered to your inbox.',
}: SubscriberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Basic validation
      if (!formData.email) {
        throw new Error('Email is required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email');
      }

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          newsletter_id: newsletterId,
          email: formData.email,
          name: formData.name || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This email is already subscribed.');
        } else {
          throw new Error(`Error subscribing: ${error.message}`);
        }
      }

      setMessage({ text: 'Successfully subscribed to the newsletter!', type: 'success' });
      setFormData({ email: '', name: '' });
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to subscribe',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg bg-background p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Input
              id="name"
              className="pl-9"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <User size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              className="pl-9"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          <span className={cn("inline-flex items-center", isLoading && "text-transparent")}>
            Subscribe
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin" size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          )}
        </Button>

        {message && (
          <p
            className={cn(
              "text-sm",
              message.type === "error" ? "text-destructive" : "text-green-600 dark:text-green-500"
            )}
            role="alert"
          >
            {message.text}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground pt-2">
          By subscribing you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}