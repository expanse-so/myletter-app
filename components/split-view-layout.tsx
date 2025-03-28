"use client"

import React, { useState, useRef } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TipTapEditor } from "./tiptap-editor"
import { AIChatInterface } from "./ai-chat-interface"
import { Editor } from '@tiptap/react'

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
  const editorRef = useRef<Editor | null>(null)
  
  const handleEditorChange = (html: string) => {
    setEditorHtml(html)
    onEditorChange?.(html)
  }
  
  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] rounded-lg border"
    >
      <ResizablePanel defaultSize={defaultEditorSize} minSize={30}>
        <div className="flex h-full flex-col bg-background">
          {editorContent || (
            <TipTapEditor 
              initialContent={editorHtml}
              onChange={handleEditorChange}
              placeholder="Write your newsletter here..."
              className="h-full"
              onEditorReady={handleEditorReady}
            />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultChatSize} minSize={30}>
        <AIChatInterface
          editor={editorRef.current}
          editorContent={editorHtml}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}