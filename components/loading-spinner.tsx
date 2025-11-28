import { LoadingSpinner as SpinnerIcon } from "@/components/icons"

export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <SpinnerIcon className="h-16 w-16 text-primary animate-spin-slow" />
        {/* Decorative circles */}
        <div
          className="absolute -inset-4 rounded-full border-4 border-dashed border-secondary/30 animate-spin-slow"
          style={{ animationDuration: "8s", animationDirection: "reverse" }}
        />
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}
