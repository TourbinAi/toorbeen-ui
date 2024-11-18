"use client"

import React from "react"
import { useFormContext } from "react-hook-form"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { cn } from "@/lib/styles"
import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { AppFormDescription } from "./AppFormDescription"
import { AppFormLabel } from "./AppFormLabel"

/**
 * AppCheckbox component documentation.
 *
 * This module exports the AppCheckbox component, which is a form input field
 * that provides a checkbox feature. It uses the `Checkbox` component from
 * `@/components/ui/checkbox` and the `useFormContext` hook from `react-hook-form`.
 *
 * The component accepts several props, including `name`, `label`, `containerClassName`,
 * `fieldClassName`, and `description`.
 *
 * @see Props
 * @see AppCheckbox
 */

/**
 * Props for the AppCheckbox component.
 *
 * @typedef {Object} Props
 * @property {string} name - The name of the form field.
 * @property {React.ReactNode} [label] - The label for the form field.
 * @property {string} [containerClassName] - The class name for the container element.
 * @property {string} [fieldClassName] - The class name for the field element.
 * @property {React.ReactNode} [description] - The description for the form field.
 * @property {React.InputHTMLAttributes<HTMLInputElement>} nativeProps - The native props for the form field.
 */

type Props = {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">

export function AppCheckbox({
  name,
  label,
  containerClassName,
  fieldClassName,
  description,
  ...nativeProps
}: Props) {
  removeThisWhenYouNeedMe("AppCheckbox")

  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            containerClassName,
            "flex flex-col justify-center justify-items-center"
          )}
        >
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <CheckboxComponent
                {...field}
                {...(nativeProps as any)}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={fieldClassName}
              />
            </FormControl>

            <div className="space-y-1 leading-none">
              <AppFormLabel
                label={label}
                fieldState={fieldState}
                required={nativeProps.required}
              />

              <AppFormDescription description={description} />
            </div>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
