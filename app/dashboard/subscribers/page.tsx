'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Newsletter } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';

export default function SubscribersPage() {
  const { isAuthenticated, profile } = useAuth();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch newsletters to populate the selection dropdown
  useEffect(() => {
    const fetchNewsletters = async () => {
      if (!isAuthenticated || !profile) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get newsletters owned by the user
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .eq('user_id', profile.id);
        
        if (error) {
          throw error;
        }
        
        setNewsletters(data || []);
        
        // Automatically select the first newsletter if available
        if (data && data.length > 0) {
          setSelectedNewsletterId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching newsletters:', err);
        setError(err instanceof Error ? err.message : 'Error loading newsletters');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletters();
  }, [isAuthenticated, profile]);

  const handleSubscriberAdded = () => {
    // Switch to list view after successful subscription
    setActiveTab('list');
  };

  if (loading) {
    return <div className="container p-6 flex justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Authentication Required</h3>
          <div className="mt-2 text-sm text-red-700">
            Please <a href="/login" className="underline font-medium">log in</a> to access this page.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (newsletters.length === 0) {
    return (
      <div className="container p-6">
        <div className="rounded-md border p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold mb-2">No newsletters found</h2>
          <p className="text-muted-foreground mb-4">
            Create a newsletter first to manage subscribers.
          </p>
          <a
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Subscriber Management</h1>
        <p className="text-muted-foreground">
          View, add, and manage subscribers for your newsletters.
        </p>
      </div>

      <div className="mb-4">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedNewsletterId || ''}
          onChange={(e) => setSelectedNewsletterId(e.target.value)}
        >
          {newsletters.map((newsletter) => (
            <option key={newsletter.id} value={newsletter.id}>
              {newsletter.name || newsletter.title}
            </option>
          ))}
        </select>
      </div>

      {selectedNewsletterId && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setActiveTab('list')}>Subscribers List</Button>
            <Button onClick={() => setActiveTab('add')}>Add Subscriber</Button>
          </div>
          
          <div className="p-4 border rounded-md">
            {activeTab === 'list' ? (
              <div className="text-center py-8">
                <p>Subscriber list will be displayed here once available</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Add subscriber form will be displayed here once available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}