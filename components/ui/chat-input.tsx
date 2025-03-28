"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true }));
        }
      }
    };

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      const target = event.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full resize-none rounded-md border-0 bg-transparent p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        rows={1}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
ChatInput.displayName = "ChatInput"

export { ChatInput }