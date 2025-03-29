"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubscriberFormProps {
  newsletterId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubscriberForm({ newsletterId, onSuccess, onCancel }: SubscriberFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" placeholder="email@example.com" />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name (Optional)
        </label>
        <Input id="name" placeholder="John Doe" />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button>Add Subscriber</Button>
      </div>
    </div>
  );
}