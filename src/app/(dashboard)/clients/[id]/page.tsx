import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Plus, Mail, Phone, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArchiveClientButton } from '@/components/clients/archive-client-button'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client || client.is_archived) {
    notFound()
  }

  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .eq('client_id', id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Link href="/clients" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a Clientes
          </Link>
          <div>
            <h1 className="text-section text-white mb-2">{client.name}</h1>
            <p className="text-subhead flex flex-wrap items-center gap-4 text-[var(--muted)]">
              {client.email && (
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {client.email}</span>
              )}
              {client.phone && (
                <span className="flex items-center"><Phone className="w-4 h-4 mr-1"/> {client.phone}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ArchiveClientButton
            clientId={id}
            clientName={client.name}
            variant="full"
          />
          <Link href={`/cases/new?clientId=${id}`}>
            <Button variant="primary"><Plus className="w-4 h-4 mr-2"/>Nuevo Caso</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Detalles del Cliente */}
        <div className="space-y-6">
          <Card>
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-white">Información</h2>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--muted)]">Fecha de Registro</p>
                <p className="text-white mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(client.created_at).toLocaleDateString('es-MX')}
                </p>
              </div>
              {client.notes && (
                <div>
                  <p className="text-sm font-medium text-[var(--muted)]">Notas</p>
                  <p className="text-white mt-1 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Casos */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Casos del Cliente ({cases?.length || 0})
              </h2>
            </div>
            <CardContent className="p-0">
              {cases && cases.length > 0 ? (
                <ul className="divide-y divide-[var(--border)]">
                  {cases.map((c) => (
                    <li key={c.id} className="p-4 px-6 hover:bg-white/5 transition-colors group block">
                      <Link href={`/cases/${c.id}`} className="block">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-white group-hover:text-[var(--primary)] transition-colors">{c.title}</h3>
                          <Badge variant={
                            c.status === 'active' ? 'success' :
                            c.status === 'in_progress' ? 'warning' : 'default'
                          }>
                            {c.status === 'active' ? 'Activo' : 
                             c.status === 'in_progress' ? 'En Progreso' : 
                             c.status === 'closed' ? 'Cerrado' : 'Archivado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--muted)] line-clamp-2">{c.description || 'Sin descripción'}</p>
                        <p className="text-xs text-[var(--muted)] mt-4">Actualizado: {new Date(c.updated_at).toLocaleDateString('es-MX')}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">Sin casos</h3>
                  <p className="text-[var(--muted)] mb-6">Este cliente no tiene casos registrados.</p>
                  <Link href={`/cases/new?clientId=${id}`}>
                    <Button variant="outline">Añadir el primer caso</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
