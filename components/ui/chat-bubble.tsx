"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant = "received", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full gap-2 py-2",
        variant === "sent" ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    />
  )
)
ChatBubble.displayName = "ChatBubble"

interface ChatBubbleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback?: React.ReactNode
}

const ChatBubbleAvatar = React.forwardRef<HTMLDivElement, ChatBubbleAvatarProps>(
  ({ className, src, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium">{fallback}</span>
      )}
    </div>
  )
)
ChatBubbleAvatar.displayName = "ChatBubbleAvatar"

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
  isLoading?: boolean
}

const ChatBubbleMessage = React.forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  ({ className, variant = "received", isLoading = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg px-3 py-2 text-sm",
        variant === "sent"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex h-5 items-center space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "300ms" }} />
        </div>
      ) : (
        children
      )}
    </div>
  )
)
ChatBubbleMessage.displayName = "ChatBubbleMessage"

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage }