"use client"

import { SplitViewLayout } from "@/components/split-view-layout"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"

export default function EditorPage() {
  const [content, setContent] = useState("")

  const handleEditorChange = (html: string) => {
    setContent(html)
    // In a real app, you might want to save this to a database
    console.log("Editor content changed:", html)
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <PageHeader
        heading="Newsletter Editor"
        text="Create your newsletter with our AI-powered editor."
      />
      <SplitViewLayout
        initialContent="<h1>My Newsletter</h1><p>Welcome to MyLetter! Start writing your amazing newsletter here.</p>"
        onEditorChange={handleEditorChange}
      />
    </div>
  )
}