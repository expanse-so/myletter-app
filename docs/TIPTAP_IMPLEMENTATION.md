# Tiptap Editor Integration

This document outlines the implementation of the Tiptap editor with a split-view layout in the MyLetter application.

## Overview

The implementation provides a modern writing environment with AI assistance, similar to Cursor's interface, allowing users to:

1. Write and edit newsletter content in a full-featured Tiptap editor
2. Chat with an AI assistant in a side panel
3. Resize the panels as needed

## Key Components

### 1. Tiptap Editor

The `TipTapEditor` component (`components/tiptap-editor.tsx`) provides a rich text editor with:

- Text formatting (bold, italic, headings)
- Lists (bullet and ordered)
- Links
- Images
- Tables
- Undo/redo functionality

This editor uses Tiptap's extension system and can be easily extended with additional features.

### 2. Chat Interface

The `CursorChatInterface` component (`components/cursor-chat-interface.tsx`) provides a chat interface similar to Cursor, with:

- Message display with user/AI attribution
- Loading indicators
- Input field with submit functionality
- Support for handling message submission

### 3. Split View Layout

The `SplitViewLayout` component (`components/split-view-layout.tsx`) combines the editor and chat interface in a resizable layout using `react-resizable`.

- Horizontal layout with editor on left, chat on right
- Resizable divider between panels
- Flexible sizing with configurable defaults

## Integration Points

The editor is integrated into the application in two places:

1. `/editor` route - A standalone page for testing/demonstration
2. `/dashboard/editor` route - Integrated into the dashboard with proper navigation

## Future Enhancements

Potential enhancements to consider:

1. Persistent content saving to backend
2. Real AI integration for chat assistance
3. More advanced editor features (comments, mentions, etc.)
4. Collaborative editing
5. Template selection

## Usage

### Basic Example

```tsx
import { SplitViewLayout } from "@/components/split-view-layout"

export default function EditorPage() {
  const handleEditorChange = (html: string) => {
    console.log("Editor content changed:", html)
    // Save to backend, etc.
  }

  return (
    <SplitViewLayout
      initialContent="<h1>My Newsletter</h1><p>Start writing here...</p>"
      onEditorChange={handleEditorChange}
    />
  )
}
```

### Component Props

#### TipTapEditor Props

| Prop | Type | Description |
|------|------|-------------|
| `initialContent` | string | Initial HTML content |
| `onChange` | function | Callback when content changes |
| `placeholder` | string | Placeholder text |
| `editable` | boolean | Whether editor is editable |
| `className` | string | Additional CSS classes |

#### SplitViewLayout Props

| Prop | Type | Description |
|------|------|-------------|
| `defaultEditorSize` | number | Default size percentage for editor |
| `defaultChatSize` | number | Default size percentage for chat |
| `initialContent` | string | Initial HTML content for editor |
| `onEditorChange` | function | Callback when editor content changes |