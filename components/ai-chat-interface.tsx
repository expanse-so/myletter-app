"use client"

import { useState, FormEvent, useEffect, useRef } from "react"
import { Bot, User, CornerDownLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { ModelSelector } from "@/components/ui/model-selector"
import { cn } from "@/lib/utils"
import { Editor } from '@tiptap/react'
import { getProviderModels } from "@/app/api/ai/config"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  suggestions?: string[]
}

export interface AIChatInterfaceProps {
  className?: string
  initialMessages?: Message[]
  editor?: Editor | null
  editorContent?: string
  onEditorReady?: (isReady: boolean) => void
}

export function AIChatInterface({
  className,
  initialMessages = [
    {
      id: 1,
      content: "Hello! I'm your AI writing assistant. How can I help you with your newsletter today?",
      sender: "ai",
    },
  ],
  editor,
  editorContent = "",
  onEditorReady,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  // Get available models
  const openAIOptions = getProviderModels("openai").map(model => ({
    value: model.id,
    label: model.name
  }));
  
  const geminiOptions = getProviderModels("google").map(model => ({
    value: model.id,
    label: model.name
  }));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  
  // Notify parent when ready
  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(true);
    }
    
    return () => {
      if (onEditorReady) {
        onEditorReady(false);
      }
    };
  }, [onEditorReady]);

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

    try {
      // Get current editor content for context
      const currentEditorContent = editor?.getHTML() || editorContent
      
      // Call our AI API route
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          model: selectedModel,
          editorContent: currentEditorContent,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const data = await response.json()
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: data.response,
        sender: "ai",
        suggestions: data.edits?.map((edit: any) => 
          `Apply ${edit.type} change to editor`
        ),
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
  }

  const handleApplySuggestion = (suggestion: string, messageContent: string) => {
    if (!editor) return;
    
    // Extract operation from suggestion
    const operation = suggestion.includes('replace') ? 'replace' :
                      suggestion.includes('add') ? 'add' :
                      suggestion.includes('delete') ? 'delete' : null;
    
    if (!operation) return;
    
    // Simple parsing to extract potential content changes
    if (operation === 'replace') {
      const regex = /Replace \"(.*)\" with \"(.*?)\"/;
      const match = messageContent.match(regex);
      
      if (match && match.length >= 3) {
        const [_, oldText, newText] = match;
        // Since Tiptap doesn't have a find method, we need to use insertContent instead
        editor.chain().focus().insertContent(newText).run();
      } else {
        // Fallback for when regex doesn't match
        const contentToAdd = messageContent.split("\"").find(part => part.length > 20) || "Suggested content";
        editor.chain().focus().createParagraphNear().insertContent(contentToAdd).run();
      }
    } else if (operation === 'add') {
      // Extract what appears to be content suggestions (look for quoted text or paragraphs)
      const contentToAdd = messageContent.split("\"").find(part => part.length > 20) || 
                          messageContent.split("\n").find(line => line.length > 30) || 
                          "Added content";
      
      editor.chain().focus().createParagraphNear().insertContent(contentToAdd).run();
    } else if (operation === 'delete') {
      // Since we don't have a direct find/delete method, we'll just insert a placeholder message
      editor.chain().focus().createParagraphNear().insertContent("Content deletion requested. Please manually delete the unwanted content.").run();
    }
  }

  return (
    <div className={cn("flex flex-col h-full border rounded-md bg-background", className)}>
      <div className="border-b p-3 flex justify-between items-center">
        <h3 className="font-medium">AI Assistant</h3>
        <ModelSelector 
          openAIOptions={openAIOptions}
          geminiOptions={geminiOptions}
          value={selectedModel}
          onValueChange={setSelectedModel}
        />
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
                fallback={message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              />
              <div className="flex flex-col w-full max-w-[80%]">
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
                
                {message.sender === "ai" && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleApplySuggestion(suggestion, message.content)}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
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
            placeholder={`Ask ${selectedModel.split('-').join(' ')} for help...`}
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