// src/components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-white p-4 shadow", className)} {...props} />
  )
)
Card.displayName = "Card"
