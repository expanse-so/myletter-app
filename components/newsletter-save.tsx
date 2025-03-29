"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { debounce } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly in this component to avoid circular dependencies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NewsletterSaveProps {
  content: string;
  title: string;
  newsletterId?: string;
  onSaveComplete?: (id: string) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function NewsletterSave({
  content,
  title,
  newsletterId,
  onSaveComplete,
  autoSave = false,
  autoSaveInterval = 30000,
}: NewsletterSaveProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const saveNewsletter = async () => {
    if (!content || !title) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .upsert({
          id: newsletterId,
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      if (onSaveComplete && data) {
        onSaveComplete(data.id);
      }
    } catch (err) {
      console.error('Error saving newsletter:', err);
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };
  
  // Debounced version of save for auto-save
  const debouncedSave = useCallback(
    debounce(() => {
      saveNewsletter();
    }, 500),
    [content, title, newsletterId]
  );
  
  // Set up auto-save
  useEffect(() => {
    if (!autoSave) return;
    
    const interval = setInterval(() => {
      debouncedSave();
    }, autoSaveInterval);
    
    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, debouncedSave]);
  
  return (
    <div className="flex items-center gap-2">
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      
      {saved && !saving && (
        <div className="text-sm text-green-500">Saved</div>
      )}
      
      <Button 
        onClick={saveNewsletter} 
        disabled={saving || !content || !title}
        size="sm"
      >
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}