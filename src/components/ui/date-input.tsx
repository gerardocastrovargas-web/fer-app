'use client'

import { useState, useRef } from 'react'
import { Calendar } from 'lucide-react'

interface DateInputProps {
  name: string
  required?: boolean
}

export function DateInput({ name, required }: DateInputProps) {
  const [value, setValue] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '')
    
    if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2)
    if (raw.length > 5) raw = raw.slice(0, 5) + '/' + raw.slice(5)
    if (raw.length > 10) raw = raw.slice(0, 10)
    
    setValue(raw)
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value // yyyy-mm-dd
    if (!dateVal) return
    
    const [y, m, d] = dateVal.split('-')
    setValue(`${d}/${m}/${y}`)
  }

  const getISODate = () => {
    const parts = value.split('/')
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    return ''
  }

  const openPicker = () => {
    if (dateInputRef.current) {
      try {
        // @ts-ignore - showPicker is modern and might not be in all type defs yet
        dateInputRef.current.showPicker()
      } catch (err) {
        // Fallback for older browsers
        dateInputRef.current.click()
      }
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        value={value}
        onChange={handleChange}
        required={required}
        maxLength={10}
        className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
      />
      
      <button 
        type="button"
        onClick={openPicker}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white transition-colors"
      >
        <Calendar className="w-4 h-4" />
      </button>

      {/* Input nativo oculto para el picker */}
      <input 
        ref={dateInputRef}
        type="date"
        className="sr-only"
        onChange={handleNativeChange}
        tabIndex={-1}
      />

      {/* Hidden input con el valor en formato ISO para el servidor */}
      <input type="hidden" name={name} value={getISODate()} />
    </div>
  )
}
