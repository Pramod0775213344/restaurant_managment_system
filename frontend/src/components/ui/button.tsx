import * as React from "react"

import { cn } from "cn"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "icon-sm" | "icon" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variant === "ghost" && "hover:bg-gray-100",
        variant === "outline" && "border border-gray-200 bg-transparent hover:bg-gray-100",
        size === "icon-sm" || size === "icon" ? "size-8" : size === "lg" ? "h-12 px-5" : "h-10 px-4 py-2",
        className
      )}
      {...props}
    />
  )
)

Button.displayName = "Button"
