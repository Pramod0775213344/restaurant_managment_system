import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "cn"

interface SelectContextValue {
  value: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedLabel: string
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  children: React.ReactNode
}

export function Select({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  disabled,
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const rootRef = React.useRef<HTMLDivElement>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  React.useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
        disabled,
      }}
    >
      <div ref={rootRef} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error("SelectTrigger must be used within Select")

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={ctx.open}
      disabled={ctx.disabled}
      onClick={() => ctx.setOpen((prev) => !prev)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-sm shadow-xs placeholder:text-gray-400 outline-none transition-colors focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          ctx.open && "rotate-180"
        )}
      />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export function SelectValue({
  placeholder = "Select an option",
  className,
  children,
}: {
  placeholder?: string
  className?: string
  children?: React.ReactNode
}) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error("SelectValue must be used within Select")

  const displayText = children ?? (ctx.selectedLabel || undefined)

  return (
    <span
      className={cn(
        "truncate block text-left",
        !displayText && "text-muted-foreground",
        className
      )}
    >
      {displayText || placeholder}
    </span>
  )
}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error("SelectContent must be used within Select")

  return (
    <div
      ref={ref}
      style={{ display: ctx.open ? "block" : "none" }}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in-80 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

export interface SelectItemProps extends React.ComponentProps<"div"> {
  value: string
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    if (!ctx) throw new Error("SelectItem must be used within Select")

    const isSelected = ctx.value === value

    // Sync selected label when item matches context value
    React.useEffect(() => {
      if (isSelected && typeof children === "string") {
        ctx.setSelectedLabel(children)
      }
    }, [isSelected, children, ctx])

    const handleSelect = () => {
      ctx.onValueChange?.(value)
      if (typeof children === "string") {
        ctx.setSelectedLabel(children)
      }
      ctx.setOpen(false)
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={handleSelect}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
          isSelected && "bg-gray-100/70 font-medium text-gray-950",
          className
        )}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-gray-900">
            <Check className="h-4 w-4" />
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"
