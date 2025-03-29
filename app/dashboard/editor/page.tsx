'use client';

import { useState } from 'react';

export default function DashboardEditorPage() {
  const [content, setContent] = useState('');
  
  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Newsletter Editor</h1>
        <p className="text-gray-600">Create and edit your newsletter content</p>
      </div>
      
      <div className="border rounded-md p-4">
        <textarea
          className="w-full min-h-[300px] p-3 border rounded-md"
          placeholder="Start writing your newsletter content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}