export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Newsletter = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Letter = {
  id: string;
  newsletter_id: string;
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'sent';
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  id: string;
  newsletter_id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed';
  created_at: string;
  updated_at: string;
};

export type AiChatMessage = {
  id: string;
  letter_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Database = {
  profiles: Profile;
  newsletters: Newsletter;
  letters: Letter;
  subscribers: Subscriber;
  ai_chat_messages: AiChatMessage;
};