import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Briefcase, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { SearchInput } from '@/components/ui/search-input'
import { StatusFilter } from '@/components/ui/status-filter'

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  
  const q = typeof params.q === 'string' ? params.q : ''
  const status = typeof params.status === 'string' ? params.status : ''

  let query = supabase
    .from('cases')
    .select('*, clients(name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data: cases } = await query

  const statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Cerrado', value: 'closed' }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-section text-white mb-2">Casos</h1>
          <p className="text-subhead text-[var(--muted)]">Administra y da seguimiento a tus asuntos legales activos.</p>
        </div>
        <Link href="/cases/new">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Caso
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
        <SearchInput placeholder="Buscar por título..." />
        <div className="w-full sm:w-auto">
          <StatusFilter options={statusOptions} placeholder="Todos los estados" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {cases && cases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-sm font-medium text-[var(--muted)]">
                    <th className="p-4 px-6">Título</th>
                    <th className="p-4 px-6 md:table-cell hidden">Cliente</th>
                    <th className="p-4 px-6">Estado</th>
                    <th className="p-4 px-6 opacity-0">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 px-6">
                        <Link href={`/cases/${c.id}`} className="font-medium text-white group-hover:text-[var(--primary)] transition-colors">
                          {c.title}
                        </Link>
                      </td>
                      <td className="p-4 px-6 md:table-cell hidden text-[var(--muted)]">
                        {/* @ts-ignore */}
                        {c.clients?.name || 'Desconocido'}
                      </td>
                      <td className="p-4 px-6">
                        <Badge variant={
                          c.status === 'active' ? 'success' :
                          c.status === 'in_progress' ? 'warning' : 'default'
                        }>
                          {c.status === 'active' ? 'Activo' : 
                           c.status === 'in_progress' ? 'En Progreso' : 
                           c.status === 'closed' ? 'Cerrado' : 'Archivado'}
                        </Badge>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <Link href={`/cases/${c.id}`}>
                          <Button variant="secondary" size="sm">
                            Ver detalles
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                {q || status ? 'No se encontraron resultados' : 'Ningún caso registrado'}
              </h3>
              <p className="text-[var(--muted)] mb-6">
                {q || status ? 'Intenta ajustando los filtros de búsqueda.' : 'Comienza creando un asunto legal para un cliente.'}
              </p>
              {!q && !status && (
                <Link href="/cases/new">
                  <Button variant="outline">Crear el primer caso</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
