import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-shimmer rounded-md bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--color-accent)_8%,var(--color-muted)_18%,var(--color-accent)_33%)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
