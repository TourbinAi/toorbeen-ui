import { env } from "@/env.mjs"

/**
 * TailwindIndicator Component
 *
 * This component displays the current Tailwind CSS breakpoint in the bottom-left corner of the screen.
 * It's useful for development purposes to visually check which breakpoint is active.
 *
 * The component is only rendered in non-production environments.
 *
 * Breakpoints displayed:
 * - xs: < 640px (default)
 * - sm: 640px - 767px
 * - md: 768px - 1023px
 * - lg: 1024px - 1279px
 * - xl: 1280px - 1535px
 * - 2xl: >= 1536px
 */

export function TailwindIndicator() {
  // Don't render anything in production
  if (env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
