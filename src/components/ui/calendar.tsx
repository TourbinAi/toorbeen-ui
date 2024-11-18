import * as React from "react"

import "react-modern-calendar-datepicker/lib/DatePicker.css"

import {
  DayValue,
  Calendar as ModernCalendar,
} from "react-modern-calendar-datepicker"

import { cn } from "@/lib/styles"

interface CalendarProps {
  value: DayValue | null
  onChange: (value: DayValue | null) => void
  className?: string
  shouldHighlightWeekends?: boolean
  locale?: string
}

function Calendar({
  value,
  onChange,
  className,
  shouldHighlightWeekends = true,
  locale = "fa",
}: CalendarProps) {
  // Ensure value is not null and set a default if it is
  const dateValue = value || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }

  return (
    <div className={cn("w-full p-3", className)}>
      <ModernCalendar
        value={dateValue}
        onChange={onChange}
        shouldHighlightWeekends={shouldHighlightWeekends}
        locale={locale}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
