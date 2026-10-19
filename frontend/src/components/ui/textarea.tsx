import * as React from "react"
import { cn } from "cn"

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md bg-gray-100 px-3 py-2 text-sm shadow-xs placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"
