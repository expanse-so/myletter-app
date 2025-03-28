"use client"

import { SplitViewLayout } from "@/components/split-view-layout"
import { TipTapEditor } from "@/components/tiptap-editor"
import { useState } from "react"

export default function EditorPage() {
  const [content, setContent] = useState("")

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">MyLetter Editor</h1>
      <SplitViewLayout
        editorContent={
          <TipTapEditor
            initialContent="<h1>My Newsletter</h1><p>Start writing your amazing content...</p>"
            onChange={setContent}
            placeholder="Write your newsletter here..."
          />
        }
      />
    </div>
  )
}