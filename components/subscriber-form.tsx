'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form validation schema
const subscriberSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().optional(),
});

type SubscriberFormValues = z.infer<typeof subscriberSchema>;

interface SubscriberFormProps {
  newsletterId: string;
  onSuccess?: (data: any) => void;
}

export function SubscriberForm({ newsletterId, onSuccess }: SubscriberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({
    type: null,
    message: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (values: SubscriberFormValues) => {
    setIsSubmitting(true);
    setFormStatus({ type: null, message: null });

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          newsletter_id: newsletterId,
          email: values.email,
          name: values.name || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          setFormStatus({
            type: 'error',
            message: 'This email is already subscribed.',
          });
        } else {
          setFormStatus({
            type: 'error',
            message: `Error subscribing: ${error.message}`,
          });
        }
      } else {
        setFormStatus({
          type: 'success',
          message: 'Successfully subscribed!',
        });
        reset();
        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'An unexpected error occurred.',
      });
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="text-xl font-semibold">Subscribe to our newsletter</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {formStatus.message && (
          <div
            className={`p-3 rounded ${
              formStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {formStatus.message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}