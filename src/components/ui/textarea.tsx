// src/components/ui/textarea.tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn("flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm", className)}
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
