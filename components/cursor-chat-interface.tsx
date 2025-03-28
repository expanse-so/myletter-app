"use client"

import { useState, FormEvent, useRef, useEffect } from "react"
import { Bot, User, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
}

export interface CursorChatInterfaceProps {
  className?: string
  initialMessages?: Message[]
  onSendMessage?: (message: string) => Promise<string>
  userAvatar?: string
  aiAvatar?: string
}

export function CursorChatInterface({
  className,
  initialMessages = [
    {
      id: 1,
      content: "Hello! I'm your AI writing assistant. How can I help you with your newsletter today?",
      sender: "ai",
    },
  ],
  onSendMessage,
  userAvatar,
  aiAvatar,
}: CursorChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    if (onSendMessage) {
      try {
        const response = await onSendMessage(input)
        const aiMessage: Message = {
          id: Date.now() + 1,
          content: response,
          sender: "ai",
        }
        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage: Message = {
          id: Date.now() + 1,
          content: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } else {
      // Demo response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            content: "This is a simulated response. In the real app, we'll connect to OpenAI or Google Gemini to provide helpful newsletter writing assistance.",
            sender: "ai",
          },
        ])
        setIsLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className={cn("flex flex-col h-full border rounded-md bg-background", className)}>
      <div className="border-b p-3">
        <h3 className="font-medium">AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={message.sender === "user" ? userAvatar : aiAvatar}
                fallback={message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={aiAvatar}
                fallback={<Bot className="h-4 w-4" />}
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      <div className="p-3 border-t">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="absolute right-2 bottom-2">
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
              className="rounded-full h-8 w-8"
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}