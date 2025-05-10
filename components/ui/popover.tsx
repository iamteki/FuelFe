import * as React from "react"

const PopoverTrigger = PopoverPrimitive.Trigger

  React.ElementRef<typeof PopoverPrimitive.Content>,
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
      ref={ref}
      sideOffset={sideOffset}
PopoverContent.displayName = PopoverPrimitive.Content.displayName
