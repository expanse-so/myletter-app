"use client";

import React from "react";
import { AddSubscriberForm } from "./add-subscriber-form";

interface SubscriberFormProps {
  newsletterId: string;
  onSuccess?: (subscriberId: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export function SubscriberForm({ 
  newsletterId, 
  onSuccess, 
  onCancel,
  title,
  description 
}: SubscriberFormProps) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <AddSubscriberForm 
        newsletterId={newsletterId}
        onSuccess={onSuccess ? subscriberId => onSuccess(subscriberId) : undefined}
        onCancel={onCancel}
      />
    </div>
  );
}