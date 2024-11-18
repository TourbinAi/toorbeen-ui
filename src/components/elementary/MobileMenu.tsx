import { navbarMenuItems } from "@/constants"
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/navigation"
import { Accordion } from "@/components/ui/accordion"

interface MobileNavLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode
}

function MobileNavLink({ children, ...props }: MobileNavLinkProps) {
  return (
    <Link className="block text-base leading-7 tracking-tight" {...props}>
      {children}
    </Link>
  )
}

const MobileMenu = () => {
  const t = useTranslations("header")
  return (
    <Popover className="lg:hidden">
      {({ open }) => (
        <>
          <PopoverButton
            className="relative z-10 -m-2 inline-flex translate-y-1 items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
            aria-label="Toggle site navigation"
          >
            {({ open }) =>
              open ? <X className="size-6" /> : <Menu className="size-6" />
            }
          </PopoverButton>
          <AnimatePresence initial={false}>
            {open && (
              <>
                <PopoverBackdrop
                  static
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                />
                <PopoverPanel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: -32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -32,
                    transition: { duration: 0.2 },
                  }}
                  className="absolute inset-x-0 top-0 z-0 w-full origin-top rounded-b-2xl bg-card px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                >
                  <div className="w-full space-y-4">
                    {navbarMenuItems.map((menuItem) => (
                      <Accordion key={menuItem.name} type="single" collapsible>
                        <MobileNavLink key={menuItem.name} href={menuItem.href}>
                          {t(`menu.${menuItem.name}`)}
                        </MobileNavLink>
                      </Accordion>
                    ))}
                  </div>
                </PopoverPanel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  )
}

export default MobileMenu
