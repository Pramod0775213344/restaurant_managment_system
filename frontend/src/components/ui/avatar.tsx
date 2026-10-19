import * as React from "react"

import { cn } from "cn"

export function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}: React.ComponentProps<"img">) {
  return <img className={cn("aspect-square size-full object-cover", className)} {...props} />
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex size-full items-center justify-center rounded-full bg-gray-100", className)}
      {...props}
    />
  )
}
