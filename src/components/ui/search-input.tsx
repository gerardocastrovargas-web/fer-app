'use client'

import { Search } from 'lucide-react'
import { Input } from './input'
import { useSearchParams } from 'next/navigation'

export function SearchInput({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  // Preserve other query parameters (e.g., status) when submitting the form
  const otherParams = Array.from(searchParams.entries()).filter(([key]) => key !== 'q')

  return (
    <form action="" method="GET" className="relative w-full sm:w-64">
      {otherParams.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
      <Input
        type="search"
        name="q"
        placeholder={placeholder}
        defaultValue={currentQuery}
        className="pl-9 w-full bg-white/5 border-[var(--border)]"
        onChange={(e) => {
          // Si el usuario borra todo, enviamos el formulario vacío para limpiar la búsqueda
          if (e.target.value === '') {
            e.target.form?.requestSubmit()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      {/* Botón oculto para permitir submit nativo si es necesario */}
      <button type="submit" className="hidden" />
    </form>
  )
}
