import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ initialContent, onChange, placeholder = 'Start writing...' }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      Image,
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  return (
    <div className="tiptap-editor">
      <div className="editor-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Ordered List"
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          Heading 2
        </button>
        <button
          onClick={() => setShowLinkDialog(!showLinkDialog)}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Link"
        >
          Link
        </button>
      </div>
      
      {showLinkDialog && (
        <div className="link-dialog">
          <form onSubmit={handleLinkSubmit}>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowLinkDialog(false)}>Cancel</button>
          </form>
        </div>
      )}
      
      <EditorContent editor={editor} />
    </div>
  );
}