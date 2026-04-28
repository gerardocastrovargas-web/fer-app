import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Archive, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function ArchivePage() {
  const supabase = await createClient()

  // Fetch archived clients
  const { data: archivedClients } = await supabase
    .from('clients')
    .select('id, name, created_at, updated_at')
    .eq('is_archived', true)
    .order('updated_at', { ascending: false })

  // Fetch archived cases
  const { data: archivedCases } = await supabase
    .from('cases')
    .select('*, clients(name)')
    .eq('is_archived', true)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section text-white flex items-center mb-2">
          <Archive className="w-8 h-8 mr-3 text-[var(--muted)]" />
          Archivo General
        </h1>
        <p className="text-subhead text-[var(--muted)]">Elementos eliminados o cerrados mediante soft-delete.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Casos Archivados */}
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[var(--muted)]" />
              Casos Archivados
            </h2>
          </div>
          <CardContent className="p-0">
            {archivedCases && archivedCases.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {archivedCases.map((c) => (
                  <li key={c.id} className="p-4 px-6 hover:bg-white/5 transition-colors">
                    <p className="font-medium text-white line-through opacity-75 text-sm">{c.title}</p>
                    {/* @ts-ignore */}
                    <p className="text-xs text-[var(--muted)] mt-1">Cliente: {c.clients?.name}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Archivado el {new Date(c.updated_at).toLocaleDateString('es-MX')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No hay casos archivados.</div>
            )}
          </CardContent>
        </Card>

        {/* Clientes Archivados */}
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-[var(--muted)]" />
              Clientes Archivados
            </h2>
          </div>
          <CardContent className="p-0">
            {archivedClients && archivedClients.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {archivedClients.map((client) => (
                  <li key={client.id} className="p-4 px-6 hover:bg-white/5 transition-colors">
                    <p className="font-medium text-white line-through opacity-75 text-sm">{client.name}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Archivado el {new Date(client.updated_at).toLocaleDateString('es-MX')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No hay clientes archivados.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
