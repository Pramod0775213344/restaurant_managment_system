import * as React from "react"

const TooltipContext = React.createContext(false)

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <TooltipContext.Provider value>{children}</TooltipContext.Provider>
}

export function TooltipTrigger({
  render,
  children,
  ...props
}: React.ComponentProps<"button"> & { render?: unknown }) {
  if (React.isValidElement(render)) {
    return React.cloneElement(render, props)
  }

  return <button type="button" {...props}>{children}</button>
}

export function TooltipContent({
  children,
  side: _side,
  align: _align,
  hidden,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}) {
  const open = React.useContext(TooltipContext)
  void _side
  void _align
  return open && !hidden ? <div {...props}>{children}</div> : null
}
