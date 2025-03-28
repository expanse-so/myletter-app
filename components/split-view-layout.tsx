"use client"

import React, { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface SplitViewLayoutProps {
  children?: React.ReactNode
  defaultEditorSize?: number
  defaultChatSize?: number
  editorContent?: React.ReactNode
  initialContent?: string
  onEditorChange?: (html: string) => void
}

export function SplitViewLayout({
  children,
  defaultEditorSize = 60,
  defaultChatSize = 40,
  editorContent,
  initialContent,
  onEditorChange,
}: SplitViewLayoutProps) {
  const [editorHtml, setEditorHtml] = useState(initialContent || '<h1>My Newsletter</h1><p>Start writing your amazing content...</p>')
  
  const handleEditorChange = (html: string) => {
    setEditorHtml(html)
    onEditorChange?.(html)
  }
  
  const handleSendMessage = async (message: string): Promise<string> => {
    // In a real implementation, this would call your AI API
    console.log("Message to AI:", message)
    console.log("Current editor content:", editorHtml)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    return "I can help you with that! Let me suggest some ideas for your newsletter content. Would you like me to help with formatting, generate content ideas, or suggest improvements to what you've written?"
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] rounded-lg border"
    >
      <ResizablePanel defaultSize={defaultEditorSize} minSize={30}>
        <div className="flex h-full flex-col bg-background">
          {editorContent || (
            <div className="h-full p-4">
              <div className="border rounded p-6 h-full flex items-center justify-center">
                <p className="text-muted-foreground">Editor content goes here</p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultChatSize} minSize={30}>
        <div className="h-full p-4">
          <div className="border rounded p-6 h-full flex items-center justify-center">
            <p className="text-muted-foreground">Chat interface goes here</p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}