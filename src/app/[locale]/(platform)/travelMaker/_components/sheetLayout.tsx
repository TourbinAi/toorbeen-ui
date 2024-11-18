import React, { Dispatch, SetStateAction } from "react"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/styles"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type SheetLayoutProps = {
  children: React.ReactNode
  sideBarComponent: React.ReactNode
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  button?: boolean
}

const SheetLayout: React.FC<SheetLayoutProps> = ({
  children,
  sideBarComponent,
  open,
  setOpen,
  button = true,
}) => {
  const t = useTranslations("travelMaker.form.form-header")
  const locale = useLocale()
  const dir = locale === "fa" ? "rtl" : "ltr"
  return (
    <div className="h-full overflow-auto">
      <div className="relative flex size-full items-stretch gap-5 p-5">
        <div
          className={cn(
            "absolutes inset-y-0 z-50 hidden h-full flex-col items-center justify-start lg:flex",
            dir === "rtl" ? "right-0" : "left-0"
          )}
        >
          <Card className="min-w[500px] m-0 w-[500px]">
            <CardHeader className="flex w-full flex-col items-center justify-center">
              <CardTitle className="pb-2">{t("title")}</CardTitle>
              <CardDescription className="text-center">
                {t("text")}
              </CardDescription>
            </CardHeader>
            <CardContent>{sideBarComponent}</CardContent>
          </Card>
        </div>
        <div className="size-full h-full grow">{children}</div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          asChild
          className={cn(
            "absolute bottom-4",
            dir === "rtl" ? "right-4" : "left-4",
            button ? "block lg:hidden" : "hidden"
          )}
        >
          <Button variant="outline" className="size-14 rounded-full">
            {open ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
        </SheetTrigger>
        <SheetContent side={dir === "rtl" ? "right" : "left"}>
          {sideBarComponent}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SheetLayout
