"use client"

import { Suspense, useState } from "react"
import { PanelRightOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { PathFinderForm } from "./form"
import MapPathFinder from "./map"
import { CarouselSpacing } from "./Tourist attractions"

function MapForm() {
  const [dataOriginForm, setDataOriginForm] = useState<any>(null)
  const [dataDestinationForm, setDataDestinationForm] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false) // State to control sheet visibility

  const handleSubmitForm = (dataOrigin: any, dataDestination: any) => {
    setDataOriginForm(dataOrigin)
    setDataDestinationForm(dataDestination)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-start overflow-y-auto">
      {/* Desktop view */}
      <div className="hidden w-full flex-row gap-4 lg:flex">
        <div className="relative mr-16 w-1/5">
          <Suspense fallback={<div>Loading...</div>}>
            <PathFinderForm
              FormData={handleSubmitForm}
              SheetOpen={setIsSheetOpen}
            />
          </Suspense>
        </div>
        <div className="ml-12 mt-2 w-4/5">
          <MapPathFinder
            origin={dataOriginForm}
            destination={dataDestinationForm}
          />
        </div>
      </div>
      {/* mobile view */}
      <div className="flex w-full flex-col lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="absolute z-20 m-4 size-14 rounded-full"
            >
              <PanelRightOpen />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <PathFinderForm
              FormData={handleSubmitForm}
              SheetOpen={setIsSheetOpen}
            />
          </SheetContent>
        </Sheet>
        <div className="z-10 w-full p-4">
          <MapPathFinder
            origin={dataOriginForm}
            destination={dataDestinationForm}
          />
        </div>
      </div>
      {/* Carousel */}
      <div className="w-11/12 pb-8">
        <CarouselSpacing destination={dataDestinationForm} />
      </div>
    </div>
  )
}

export default MapForm
