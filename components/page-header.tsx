"use client"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  heading: string
  text?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  heading,
  text,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
      {children}
    </div>
  )
}