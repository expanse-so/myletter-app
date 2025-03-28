"use client";

import { useState } from 'react';
import { JSONContent } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateEmailHtml, generatePlainTextEmail } from '@/lib/email-generator';

interface EmailPreviewProps {
  content: JSONContent;
  title: string;
  senderName: string;
  senderEmail: string;
}

export function EmailPreview({
  content,
  title,
  senderName,
  senderEmail
}: EmailPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>('html');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const htmlContent = generateEmailHtml(content, title, senderName);
  const plainTextContent = generatePlainTextEmail(content, title, senderName);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Email Preview</h3>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>
      
      {showPreview && (
        <div className="border rounded-md overflow-hidden">
          <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-3">
              <TabsList className="h-10">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="plain">Plain Text</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="html" className="p-0">
              <div className="p-4">
                <iframe
                  srcDoc={htmlContent}
                  className="w-full h-[500px] border rounded"
                  title="Email HTML Preview"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="plain" className="p-0">
              <div className="p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border h-[500px] overflow-auto">
                  {plainTextContent}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="source" className="p-0">
              <div className="p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border h-[500px] overflow-auto">
                  {htmlContent}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button className="bg-green-600 hover:bg-green-700">
          Send Test Email
        </Button>
        <Button variant="outline">
          Copy HTML
        </Button>
        <Button variant="outline">
          Copy Plain Text
        </Button>
      </div>
    </div>
  );
}