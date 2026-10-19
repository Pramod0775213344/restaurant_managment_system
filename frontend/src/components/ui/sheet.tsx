import * as React from "react"

import { cn } from "cn"

type SheetContextValue = {
  onOpenChange?: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue>({})

export function Sheet({
  open = false,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
} & React.ComponentProps<"div">) {
  return (
    <SheetContext.Provider value={{ onOpenChange }}>
      {open ? children : null}
    </SheetContext.Provider>
  )
}

export function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { side?: "top" | "right" | "bottom" | "left" }) {
  const { onOpenChange } = React.useContext(SheetContext)

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={() => onOpenChange?.(false)}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed z-50 bg-white shadow-lg",
          side === "left" && "inset-y-0 left-0",
          side === "right" && "inset-y-0 right-0",
          side === "top" && "inset-x-0 top-0",
          side === "bottom" && "inset-x-0 bottom-0",
          className
        )}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

export function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />
}
