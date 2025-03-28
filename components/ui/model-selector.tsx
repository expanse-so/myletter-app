"use client"

import * as React from "react"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModelOption {
  value: string
  label: string
}

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  openAIOptions?: ModelOption[]
  geminiOptions?: ModelOption[]
}

export function ModelSelector({ 
  value = "gpt-4o-mini", 
  onValueChange,
  openAIOptions = [
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4o", label: "GPT-4o" },
  ],
  geminiOptions = [
    { value: "gemini-pro", label: "Gemini Pro" },
    { value: "gemini-ultra", label: "Gemini Ultra" },
  ]
}: ModelSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Model:</span>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {openAIOptions && openAIOptions.length > 0 && (
            <SelectGroup>
              <SelectLabel>OpenAI</SelectLabel>
              {openAIOptions.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-blue-500" />
                    {model.label}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          
          {geminiOptions && geminiOptions.length > 0 && (
            <SelectGroup>
              <SelectLabel>Google</SelectLabel>
              {geminiOptions.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-green-500" />
                    {model.label}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}