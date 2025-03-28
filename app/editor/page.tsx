"use client"

import { SplitViewLayout } from "@/components/split-view-layout"
import { useState } from "react"

export default function EditorPage() {
  const [content, setContent] = useState("")

  const handleEditorChange = (html: string) => {
    setContent(html)
    // In a real app, you might want to save this to a database
    console.log("Editor content changed:", html)
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">MyLetter Editor</h1>
      <SplitViewLayout
        initialContent="<h1>My Newsletter</h1><p>Welcome to MyLetter! Start writing your amazing newsletter here.</p>"
        onEditorChange={handleEditorChange}
      />
    </div>
  )
}