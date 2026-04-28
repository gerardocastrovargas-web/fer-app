'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface Option {
  label: string
  value: string
}

interface StatusFilterProps {
  options: Option[]
  paramName?: string
  placeholder?: string
}

export function StatusFilter({ options, paramName = 'status', placeholder = 'Todos los estados' }: StatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentValue = searchParams.get(paramName) || ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (newValue) {
      params.set(paramName, newValue)
    } else {
      params.delete(paramName)
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="bg-white/5 border border-[var(--border)] text-white text-sm rounded-md px-3 py-2 h-10 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all sm:w-auto w-full"
    >
      <option value="" className="bg-[#111]">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#111]">
          {opt.label}
        </option>
      ))}
    </select>
  )
}
