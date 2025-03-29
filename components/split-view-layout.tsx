"use client";

import React from "react";

interface SplitViewLayoutProps {
  children: React.ReactNode;
}

export function SplitViewLayout({ children }: SplitViewLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {children}
    </div>
  );
}