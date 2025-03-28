"use client"

import { SplitViewLayout } from "@/components/split-view-layout"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { EmailPreview } from "@/components/email-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JSONContent } from "@tiptap/core"

export default function EditorPage() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("My Newsletter")
  const [jsonContent, setJsonContent] = useState<JSONContent>({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'My Newsletter' }]
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Welcome to MyLetter! Start writing your amazing newsletter here.' }]
      }
    ]
  })

  const handleEditorChange = (html: string, json?: JSONContent) => {
    setContent(html)
    if (json) {
      setJsonContent(json)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <PageHeader
        heading="Newsletter Editor"
        text="Create your newsletter with our AI-powered editor."
      />
      
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Email Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="border-none p-0 pt-4">
          <SplitViewLayout
            initialContent="<h1>My Newsletter</h1><p>Welcome to MyLetter! Start writing your amazing newsletter here.</p>"
            onEditorChange={handleEditorChange}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="border-none p-0 pt-4">
          <div className="min-h-[calc(100vh-15rem)] rounded-lg border p-6 bg-background">
            <EmailPreview
              content={jsonContent}
              title={title}
              senderName="MyLetter"
              senderEmail="newsletter@myletter.app"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}