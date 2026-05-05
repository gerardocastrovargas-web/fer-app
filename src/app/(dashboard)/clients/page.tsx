import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, Mail, Phone, Calendar as CalendarIcon, UserPlus, User } from 'lucide-react'
import Link from 'next/link'
import { ArchiveClientButton } from '@/components/clients/archive-client-button'

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
  const totalClients = clients?.length || 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Directorio de Clientes</h1>
          <p className="text-[var(--muted)]">Gestione su cartera de clientes con precisión. Acceda a expedientes, contactos y cronogramas de registro legal.</p>
        </div>
        <Link href="/clients/new">
          <button className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-bold py-2.5 px-5 rounded-md flex items-center justify-center transition-colors shadow-lg shadow-[var(--primary)]/20">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </button>
        </Link>
      </div>

      <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
        <CardContent className="p-0">
          {clients && clients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]/50 bg-white/[0.02]">
                    <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase w-2/5">Nombre</th>
                    <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase w-1/4">Contacto</th>
                    <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase hidden md:table-cell">Fecha de Registro</th>
                    <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/50">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <Link href={`/clients/${client.id}`} className="font-bold text-white group-hover:text-[var(--primary)] transition-colors block text-base">
                              {client.name}
                            </Link>
                            <span className="text-xs text-[var(--muted)]">ID: CL-0{client.id.toString().substring(0,4)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[200px]">{client.email || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{client.phone || '—'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 px-6 text-sm text-[var(--muted)] hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{new Date(client.created_at).toLocaleDateString('es-MX')}</span>
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/clients/${client.id}`}>
                            <button className="px-4 py-1.5 text-sm font-medium text-white border border-[var(--border)] rounded hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                              Ver detalles
                            </button>
                          </Link>
                          <ArchiveClientButton
                            clientId={client.id}
                            clientName={client.name}
                            variant="icon"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="p-12 text-center border-t border-[var(--border)]">
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
                  <button className="px-4 py-2 border border-[var(--border)] text-white rounded hover:bg-white/5">
                    Crear cliente manualmente
                  </button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="bg-[var(--surface-card)] border-l-2 border-l-[var(--primary)] border-y border-r border-[var(--border)] p-6">
          <p className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase mb-2">Total de Clientes</p>
          <p className="text-3xl font-bold text-[var(--primary)]">{totalClients}</p>
        </Card>
        <Card className="bg-[var(--surface-card)] border-[var(--border)] p-6">
          <p className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase mb-2">Casos Activos</p>
          <p className="text-3xl font-bold text-white">432</p>
        </Card>
        <Card className="bg-[var(--surface-card)] border-[var(--border)] p-6">
          <p className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase mb-2">Altas este Mes</p>
          <p className="text-3xl font-bold text-white">+12%</p>
        </Card>
      </div>
    </div>
  )
}
