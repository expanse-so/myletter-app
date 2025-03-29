"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SubscriberListProps {
  newsletterId?: string;
}

export function SubscriberList({ newsletterId }: SubscriberListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Subscribers</h3>
        <Button size="sm">Add Subscriber</Button>
      </div>
      
      <div className="border rounded-md p-4">
        <p className="text-center text-muted-foreground py-8">
          {newsletterId 
            ? "No subscribers found for this newsletter." 
            : "Please select a newsletter to view subscribers."}
        </p>
      </div>
    </div>
  );
}