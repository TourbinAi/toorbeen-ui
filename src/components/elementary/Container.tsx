import React from "react"

import { cn } from "@/lib/styles"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Container.displayName = "Container"

export { Container }
