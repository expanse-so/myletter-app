"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  email: z.string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .max(100, {
      message: "Email cannot be longer than 100 characters.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  name: z.string().max(100, {
    message: "Name cannot be longer than 100 characters.",
  }).optional(),
  sendWelcomeEmail: z.boolean().default(true),
  note: z.string().max(500, {
    message: "Note cannot be longer than 500 characters.",
  }).optional(),
})

interface AddSubscriberFormProps {
  newsletterId: string
  onSuccess?: (subscriberId: string) => void
  onCancel?: () => void
}

export function AddSubscriberForm({ newsletterId, onSuccess, onCancel }: AddSubscriberFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      sendWelcomeEmail: true,
      note: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!newsletterId) {
      toast.error("Newsletter ID is required")
      return
    }

    setIsSubmitting(true)
    try {
      // First check if the subscriber already exists
      const { data: existingSubscriber, error: queryError } = await supabase
        .from('subscribers')
        .select('id, status')
        .eq('email', values.email)
        .eq('newsletter_id', newsletterId)
        .single()

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError
      }

      if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
          // Update the existing unsubscribed record
          const { error: updateError } = await supabase
            .from('subscribers')
            .update({
              status: 'active',
              name: values.name || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSubscriber.id)

          if (updateError) throw updateError
          
          toast.success("Subscriber reactivated successfully")
          onSuccess?.(existingSubscriber.id)
        } else {
          toast.info("This email is already subscribed to this newsletter")
        }
        return
      }

      // Create new subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          {
            newsletter_id: newsletterId,
            email: values.email,
            name: values.name || null,
            status: 'active',
            notes: values.note || null,
          },
        ])
        .select()

      if (error) throw error

      // If sendWelcomeEmail is true, call the welcome email API
      if (values.sendWelcomeEmail) {
        // Implement welcome email logic if needed
        // This could call an API endpoint or a server action
      }

      toast.success("Subscriber added successfully")
      
      if (data && data[0]) {
        onSuccess?.(data[0].id)
      } else {
        onSuccess?.("")
      }
      
      form.reset()
    } catch (error) {
      console.error("Error adding subscriber:", error)
      toast.error("Failed to add subscriber")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Personalize your emails by including the subscriber's name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any notes about this subscriber here..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Private notes visible only to you and your team.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sendWelcomeEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Send welcome email</FormLabel>
                <FormDescription>
                  Send an automatic welcome email to this subscriber.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Subscriber"}
          </Button>
        </div>
      </form>
    </Form>
  )
}