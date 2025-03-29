import { Database } from '@/lib/supabase';

// Export types from database
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Newsletter = Database['public']['Tables']['newsletters']['Row'];
export type Subscriber = Database['public']['Tables']['subscribers']['Row'];
export type NewsletterContent = Database['public']['Tables']['newsletter_content']['Row'];

// Additional types for state management
export type NewsletterWithCounts = Newsletter & {
  subscriber_count: number;
  sent_count: number;
};

export type SubscriberWithNewsletter = Subscriber & {
  newsletter: {
    title: string;
  };
};

export type NewsletterContentWithCounts = NewsletterContent & {
  open_count: number;
  click_count: number;
};