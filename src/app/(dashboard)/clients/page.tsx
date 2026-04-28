import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { SearchInput } from '@/components/ui/search-input'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  
  const q = typeof params.q === 'string' ? params.q : ''

  let query = supabase
    .from('clients')
    .select('id, name, email, phone, created_at')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: clients } = await query

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-section text-white mb-2">Clientes</h1>
          <p className="text-subhead">Gestiona tu cartera de clientes y su información de contacto.</p>
        </div>
        <Link href="/clients/new">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <div className="flex w-full">
        <SearchInput placeholder="Buscar por nombre..." />
      </div>

      <Card>
        <CardContent className="p-0">
          {clients && clients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-sm font-medium text-[var(--muted)]">
                    <th className="p-4 px-6 font-medium">Nombre</th>
                    <th className="p-4 px-6 font-medium">Contacto</th>
                    <th className="p-4 px-6 font-medium hidden md:table-cell">Fecha de Registro</th>
                    <th className="p-4 px-6 font-medium opacity-0">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 px-6">
                        <Link href={`/clients/${client.id}`} className="font-medium text-white group-hover:text-[var(--primary)] transition-colors">
                          {client.name}
                        </Link>
                      </td>
                      <td className="p-4 px-6">
                        <p className="text-sm text-white">{client.email || '—'}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{client.phone || '—'}</p>
                      </td>
                      <td className="p-4 px-6 text-sm text-[var(--muted)] hidden md:table-cell">
                        {new Date(client.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="p-4 px-6 text-right">
                        <Link href={`/clients/${client.id}`}>
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
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                {q ? 'No se encontraron resultados' : 'Ningún cliente todavía'}
              </h3>
              <p className="text-[var(--muted)] mb-6">
                {q ? 'Intenta ajustando tu búsqueda.' : 'Comienza registrando tu primer cliente.'}
              </p>
              {!q && (
                <Link href="/clients/new">
                  <Button variant="outline">Crear cliente manualmente</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
