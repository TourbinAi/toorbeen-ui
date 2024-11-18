import React from "react"
import Image from "next/image"
import { ClassValue } from "clsx"
import { useTranslations } from "next-intl"
import logo from "public/assets/images/logo.png"

import { cn } from "@/lib/styles"

/**
 * Logo component.
 *
 * This component renders the logo of the application. It consists of a logomark
 * and a text label. The logomark is an SVG icon, and the text label is a simple
 * text element.
 *
 * The component accepts a `className` prop, which is used to apply custom styles
 * to the logo container.
 *
 * @see LogoProps
 * @see Logomark
 */

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export function Logomark(props: SVGProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 40C8.954 40 0 31.046 0 20S8.954 0 20 0s20 8.954 20 20-8.954 20-20 20ZM4 20c0 7.264 5.163 13.321 12.02 14.704C17.642 35.03 19 33.657 19 32V8c0-1.657-1.357-3.031-2.98-2.704C9.162 6.68 4 12.736 4 20Z"
      />
    </svg>
  )
}

interface LogoProps {
  className: ClassValue
}

export function Logo({ className }: LogoProps) {
  const t = useTranslations("localeLayout")
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-x-2",
        className
      )}
    >
      <Image alt="logo" width={70} height={70} src={logo} />
    </div>
  )
}
