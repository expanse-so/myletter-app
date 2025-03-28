"use client"

import React, { useState, FormEvent } from "react"
import { Send, Paperclip, Mic, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
}

interface SplitViewLayoutProps {
  children?: React.ReactNode
  defaultEditorSize?: number
  defaultChatSize?: number
  editorContent?: React.ReactNode
}

export function SplitViewLayout({
  children,
  defaultEditorSize = 60,
  defaultChatSize = 40,
  editorContent,
}: SplitViewLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI writing assistant. How can I help you today?",
      sender: "ai",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (this would be replaced with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        content: "This is a simulated AI response. In the real app, this would call the AI API.",
        sender: "ai",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-4rem)] rounded-lg border"
    >
      <ResizablePanel defaultSize={defaultEditorSize} minSize={30}>
        <div className="flex h-full flex-col bg-background">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Editor</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {editorContent || children}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultChatSize} minSize={30}>
        <div className="flex h-full flex-col bg-background">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg bg-muted p-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <div className="absolute right-0 top-0 flex h-full items-center space-x-1 pr-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" size="icon">
                <CornerDownLeft className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}