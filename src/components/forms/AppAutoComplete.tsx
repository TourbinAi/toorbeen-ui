"use client"

import React from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/styles"
import { AutoComplete } from "@/components/ui/autoComplete"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { AppFormDescription } from "./AppFormDescription"
import { AppFormLabel } from "./AppFormLabel"

type Props<T extends string> = {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
  readonly items: { value: T; label: string }[]
  readonly isLoading?: boolean
  readonly emptyMessage?: string
  readonly placeholder?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">

/**
 * AppAutoComplete component documentation.
 *
 * This module exports the AppAutoComplete component, which is a form input field
 * that provides an autocomplete feature. It uses the `AutoComplete` component from
 * `@/components/ui/autoComplete` and the `useFormContext` hook from `react-hook-form`.
 *
 * The component accepts several props, including `name`, `label`, `containerClassName`,
 * `fieldClassName`, `description`, `items`, `isLoading`, `emptyMessage`, and `placeholder`.
 *
 * @see Props
 * @see AppAutoComplete
 */

/**
 * Props for the AppAutoComplete component.
 *
 * @typedef {Object} Props
 * @property {string} name - The name of the form field.
 * @property {React.ReactNode} [label] - The label for the form field.
 * @property {string} [containerClassName] - The class name for the container element.
 * @property {string} [fieldClassName] - The class name for the field element.
 * @property {React.ReactNode} [description] - The description for the form field.
 * @property {{ value: string; label: string }[]} items - The list of autocomplete items.
 * @property {boolean} [isLoading] - Whether the autocomplete is loading.
 * @property {string} [emptyMessage] - The message to display when there are no autocomplete items.
 * @property {string} [placeholder] - The placeholder text for the form field.
 * @property {React.InputHTMLAttributes<HTMLInputElement>} nativeProps - The native props for the form field.
 */

export function AppAutoComplete<T extends string>({
  name,
  label,
  containerClassName,
  description,
  items,
  isLoading,
  emptyMessage,
  placeholder,
  ...nativeProps
}: Props<T>) {
  const { control } = useFormContext()

  const transformedItems = items.map((item) => ({
    address: "",
    category: "",
    location: { x: 0, y: 0 },
    region: "",
    title: item.label, // map label to title
    type: "",
  }))

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(containerClassName)}>
          <AppFormLabel
            fieldState={fieldState}
            label={label}
            required={nativeProps.required}
          />

          <FormControl>
            <AutoComplete
              selectedValue={field.value}
              onSelectedValueChange={field.onChange}
              searchValue={field.value}
              onSearchValueChange={(value) => {
                field.onChange(value)
              }}
              items={transformedItems}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              placeholder={placeholder}
            />
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
