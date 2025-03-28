"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteSubscriberDialogProps {
  subscriberName?: string;
  email?: string;
  onDelete: () => void;
  trigger?: React.ReactNode;
}

export function DeleteSubscriberDialog({
  subscriberName,
  email,
  onDelete,
  trigger,
}: DeleteSubscriberDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || <Button variant="outline">Delete subscriber</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background"
            aria-hidden="true"
          >
            <Trash2 className="text-destructive opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              {subscriberName 
                ? `Are you sure you want to delete ${subscriberName} (${email || 'no email'})? This action cannot be undone.` 
                : email 
                  ? `Are you sure you want to delete ${email}? This action cannot be undone.`
                  : "Are you sure you want to delete this subscriber? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}