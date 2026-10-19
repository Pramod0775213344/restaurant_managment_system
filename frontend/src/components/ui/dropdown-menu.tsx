import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "cn"

type DropdownContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) {
      return
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className="dropdown-menu-root relative">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext)

  if (asChild && React.isValidElement(children)) {
    type TriggerElementProps = {
      onClick?: React.MouseEventHandler
      "data-state"?: "open" | "closed"
      "aria-expanded"?: boolean
    }

    return React.cloneElement(
      children as React.ReactElement<TriggerElementProps>,
      {
        ...props,
        "data-state": context?.open ? "open" : "closed",
        "aria-expanded": context?.open,
        onClick: (event: React.MouseEvent) => {
          props.onClick?.(event as React.MouseEvent<HTMLButtonElement>)
          context?.setOpen((value) => !value)
        },
      }
    )
  }

  return (
    <button
      type="button"
      {...props}
      data-state={context?.open ? "open" : "closed"}
      aria-expanded={context?.open}
      onClick={(event) => {
        props.onClick?.(event)
        context?.setOpen((value) => !value)
      }}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  className,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  const context = React.useContext(DropdownContext)

  return context?.open ? (
    <div
      className={cn(
        "dropdown-menu-content absolute z-50 min-w-40 rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-lg",
        side === "right" && "left-full top-0",
        side === "left" && "right-full top-0",
        side === "top" && "bottom-full left-0",
        side === "bottom" && "top-full left-0",
        align === "end" && (side === "top" || side === "bottom") && "right-0 left-auto",
        align === "end" && (side === "left" || side === "right") && "top-auto bottom-0",
        side === "right" && "ml-1",
        side === "left" && "mr-1",
        side === "top" && "mb-1",
        side === "bottom" && "mt-1",
        className
      )}
      data-state="open"
      role="menu"
      style={{ "--dropdown-offset": `${sideOffset}px` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  ) : null
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
}

export function DropdownMenuItem({
  className,
  variant: _variant,
  onClick,
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" }) {
  const context = React.useContext(DropdownContext)

  void _variant
  return (
    <div
      role="menuitem"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-100",
        _variant === "destructive" && "text-red-600 hover:bg-red-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        context?.setOpen(false)
      }}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" className={cn("my-1 h-px bg-gray-200", className)} {...props} />
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<"div"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}

