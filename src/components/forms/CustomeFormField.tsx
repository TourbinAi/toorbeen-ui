import React from "react"
import Image from "next/image"
import { DayValue } from "@hassanmojab/react-modern-calendar-datepicker"
import { E164Number } from "libphonenumber-js/core"
import { icons } from "lucide-react"
import { useLocale } from "next-intl"
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form"
import PhoneInput from "react-phone-number-input"
import * as z from "zod"

import { cn } from "@/lib/styles"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multiSelect"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export enum FormFieldType {
  NUMBER = "number",
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  MULTISELECT = "multiselect",
  SELECT = "select",
  SKELETON = "skeleton",
}

type Option = Record<"value" | "label", string>
interface CustomProps<
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = z.infer<TSchema>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName // Update this line
  label?: string
  placeholder?: string
  iconLucid?: keyof typeof icons
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  options?: Option[]
  searchText?: string
  selectAllText?: string
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, TName>
  ) => React.ReactElement
  fieldType: FormFieldType
  onChange?: (value: any) => void
}

interface RenderInputProps<
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = z.infer<TSchema>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>
  props: CustomProps<TSchema, TFieldValues, TName>
}

function RenderInput<
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = z.infer<TSchema>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, props }: RenderInputProps<TSchema, TFieldValues, TName>) {
  const local = useLocale()

  switch (props.fieldType) {
    case FormFieldType.INPUT:
    case FormFieldType.NUMBER:
      return (
        <div className="border-dark-500 bg-dark-400flex flex w-full cursor-pointer flex-row items-center gap-2 rounded-md border ltr:flex-row-reverse">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          {props.iconLucid && (
            <Icon
              name={props.iconLucid}
              className="m-2"
              width={24}
              height={24}
            />
          )}
          <FormControl>
            <Input
              type={
                props.fieldType === FormFieldType.NUMBER ? "number" : "text"
              }
              {...field}
              placeholder={props.placeholder}
              className="shad-input border-0"
              onChange={(e) => {
                field.onChange(e.target.value)
                if (props.onChange) {
                  props.onChange(e.target.value)
                }
              }}
            />
          </FormControl>
        </div>
      )
    case FormFieldType.MULTISELECT:
      return (
        <FormControl>
          <MultiSelect
            options={props?.options || []}
            defaultValue={(props?.options || [])
              ?.map((prop) => prop.value)
              .filter((option) => field.value.includes(option))}
            onValueChange={(newSelected) => {
              field.onChange(newSelected)
            }}
            placeholder={props.placeholder}
            searchText={props.searchText}
            selectAllText={props.selectAllText}
          />
        </FormControl>
      )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      )
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className="border-dark-500 bg-dark-400 flex w-full cursor-pointer flex-row items-center gap-2 rounded-md border ltr:flex-row-reverse">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl className="w-full">
                <Button
                  variant="outline"
                  className={cn(
                    "",
                    !field.value && "w-full align-middle text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    `${field.value.day}-${field.value.month}-${field.value.year}`
                  ) : (
                    <span>{props.placeholder || "Pick a date"}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                value={field.value || null}
                onChange={(date: DayValue | null) => {
                  if (date && date.year && date.month && date.day) {
                    field.onChange(date)
                    if (props.onChange) props.onChange(date)
                  } else {
                    field.onChange(null)
                  }
                }}
                shouldHighlightWeekends
                locale="fa"
              />
            </PopoverContent>
          </Popover>
        </div>
      )

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                className={
                  local === "fa"
                    ? "shad-select-trigger flex justify-end text-right"
                    : "shad-select-trigger flex justify-start text-left"
                }
              >
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null
    default:
      return null
  }
}

function CustomFormField<
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = z.infer<TSchema>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: CustomProps<TSchema, TFieldValues, TName>) {
  const { control, name, label } = props

  return (
    <div className="mb-5">
      <FormField<TFieldValues, TName> // Ensure generics are passed
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-baseline gap-2">
            {props.fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel className="shad-input-label whitespace-nowrap">
                {label}
              </FormLabel>
            )}
            <RenderInput<TSchema, TFieldValues, TName> // Ensure generics are passed
              field={field}
              props={props}
            />
            <FormMessage className="shad-error" />
          </FormItem>
        )}
      />
    </div>
  )
}

export default CustomFormField
