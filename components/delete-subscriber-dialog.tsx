"use client"

import * as React from "react"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteSubscriberDialogProps {
  subscriberName?: string
  email: string
  onDelete: () => void
  trigger?: React.ReactNode
}

export function DeleteSubscriberDialog({
  subscriberName,
  email,
  onDelete,
  trigger,
}: DeleteSubscriberDialogProps) {
  const [open, setOpen] = React.useState(true)

  const handleDelete = () => {
    onDelete()
    setOpen(false)
  }

  // Determine the title and description based on whether we're deleting one or multiple subscribers
  const isMultiple = email.includes("subscribers")
  const title = isMultiple 
    ? "Delete Multiple Subscribers" 
    : `Delete ${subscriberName ? subscriberName : "Subscriber"}`
  
  const description = isMultiple
    ? `Are you sure you want to delete ${email}? This action cannot be undone.`
    : `Are you sure you want to delete ${subscriberName ? subscriberName : "the subscriber"} with email ${email}? This action cannot be undone.`

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}