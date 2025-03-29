'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardEditorPage() {
  const [content, setContent] = useState<string>('');
  
  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Newsletter Editor</h1>
        <p className="text-muted-foreground">Create and edit your newsletter content</p>
      </div>
      
      <div className="border rounded-md p-4">
        <textarea
          className="w-full min-h-[300px] p-3 border rounded-md"
          placeholder="Start writing your newsletter content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end">
          <Button>Save Draft</Button>
        </div>
      </div>
    </div>
  );
}