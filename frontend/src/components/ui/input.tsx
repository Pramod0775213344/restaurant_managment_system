import * as React from "react"

import { cn } from "cn"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)

Input.displayName = "Input"
