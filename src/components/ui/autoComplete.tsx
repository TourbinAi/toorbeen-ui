"use client"

import { useMemo, useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/styles"
import { Label } from "@/components/ui/label"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command"
import { Input } from "./input"
import { Popover, PopoverAnchor, PopoverContent } from "./popover"
import { Skeleton } from "./skeleton"

type Props<T extends string> = {
  selectedValue: T
  onSelectedValueChange: (value: T) => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  items:
    | {
        address: string
        category: string
        location: { x: number; y: number }
        region: string
        title: string
        type: string
      }[]
    | []
  isLoading?: boolean
  emptyMessage?: string
  placeholder?: string
  onChangeHandler?: (value: any) => void
  itemClickHandler?: (Value: any) => void
  lable?: string
}

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "",
  placeholder = "Search...",
  onChangeHandler,
  itemClickHandler,
  lable,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("PathFinder")
  const labels = useMemo(() => {
    if (!items) return {}
    return items.reduce(
      (acc, item) => {
        acc[item.title] = item.title
        return acc
      },
      {} as Record<string, string>
    )
  }, [items])

  const reset = () => {
    onSelectedValueChange("" as T)
    onSearchValueChange("")
  }

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {}

  const onSelectItem = (inputValue: string) => {
    if (inputValue === selectedValue) {
      reset()
    } else {
      onSelectedValueChange(inputValue as T)
      onSearchValueChange(labels[inputValue] ?? "")
    }
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      {lable && <Label>{lable}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input
                placeholder={placeholder}
                onChange={(e) => {
                  if (onChangeHandler) {
                    onChangeHandler(e.target.value)
                  }
                }}
              />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault()
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items?.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option, index) => (
                    <CommandItem
                      key={index}
                      value={option.title}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={() => {
                        if (itemClickHandler) {
                          itemClickHandler(option)
                        }
                        onSelectItem(option.title)
                      }}
                      onClick={() => {
                        if (itemClickHandler) {
                          itemClickHandler(option)
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === option.title
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? ""}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  )
}
