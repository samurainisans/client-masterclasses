// src/utils/formatDate.ts
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'dd MMMM yyyy', { locale: ru })
}
