  HTMLLIElement,
))
  React.ComponentPropsWithoutRef<"a"> & {
      className={cn("transition-colors hover:text-foreground", className)}
    ref={ref}
  >
  ...props
    aria-hidden="true"
