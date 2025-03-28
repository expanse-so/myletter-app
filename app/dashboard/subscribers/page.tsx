'use client';

import { useState, useEffect } from 'react';
import { SubscriberList } from '@/components/subscriber-list';
import { SubscriberForm } from '@/components/subscriber-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Newsletter } from '@/types/database';

export default function SubscribersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch newsletters to populate the selection dropdown
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        
        // Get user from session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error('User not authenticated');
        }
        
        // Get newsletters owned by the user
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .eq('user_id', session.user.id);
        
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
  }, []);

  const handleSubscriberAdded = () => {
    // Switch to list view after successful subscription
    setActiveTab('list');
  };

  if (loading) {
    return <div className="container p-6 flex justify-center">Loading...</div>;
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
              {newsletter.name}
            </option>
          ))}
        </select>
      </div>

      {selectedNewsletterId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">Subscribers List</TabsTrigger>
            <TabsTrigger value="add">Add Subscriber</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <SubscriberList 
              newsletterId={selectedNewsletterId} 
              onAddClick={() => setActiveTab('add')} 
            />
          </TabsContent>
          <TabsContent value="add">
            <SubscriberForm 
              newsletterId={selectedNewsletterId}
              onSuccess={handleSubscriberAdded}
              title={`Subscribe to ${newsletters.find(n => n.id === selectedNewsletterId)?.name}`}
              description="Add a new subscriber to your newsletter"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}