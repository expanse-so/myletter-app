"use client"

import * as React from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface AIModel {
  id: string
  name: string
  provider: string
}

export const availableModels: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "google",
  },
  {
    id: "gemini-ultra",
    name: "Gemini Ultra", 
    provider: "google",
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export function ModelSelector({ 
  selectedModel = "gpt-4o-mini", 
  onModelChange 
}: ModelSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Model:</span>
      <Select
        value={selectedModel}
        onValueChange={onModelChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}