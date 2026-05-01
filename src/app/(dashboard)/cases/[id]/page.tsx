import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, FileText, CreditCard, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PaymentsTab from '@/components/cases/payments-tab'
import EventsTab from '@/components/cases/events-tab'
import DocumentsTab from '@/components/cases/documents-tab'

export default async function CaseDetailPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
  const activeTab = tab || 'overview'

  const supabase = await createClient()

  // Fetch Case with Client info
  const { data: caseItem, error } = await supabase
    .from('cases')
    .select('*, clients(id, name)')
    .eq('id', id)
    .single()

  if (error || !caseItem || caseItem.is_archived) {
    notFound()
  }

  const tabs = [
    { id: 'overview', name: 'RESUMEN' },
    { id: 'payments', name: 'PAGOS' },
    { id: 'documents', name: 'DOCUMENTOS' },
    { id: 'events', name: 'EVENTOS' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest text-[var(--muted)] uppercase">
              <span>Expediente</span>
              <span>/</span>
              <span>Caso #2026-0{caseItem.id.toString().substring(0,3)}</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4">{caseItem.title}</h1>
            
            <p className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--muted)]">Cliente:</span>
              {/* @ts-ignore */}
              <Link href={`/clients/${caseItem.clients?.id}`} className="text-[var(--primary)] font-bold hover:underline">
                {/* @ts-ignore */}
                {caseItem.clients?.name}
              </Link>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-xs font-bold tracking-wider text-white uppercase border border-[var(--border)] rounded hover:bg-white/5 transition-colors">
              Editar Caso
            </button>
            <button className="px-5 py-2 text-xs font-bold tracking-wider text-black uppercase bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded transition-colors">
              Descargar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]/50 overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-8 min-w-max px-1" aria-label="Tabs">
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <Link
                key={t.id}
                href={`/cases/${id}?tab=${t.id}`}
                className={`
                  py-4 px-1 border-b-2 font-bold text-xs tracking-wider transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'border-[var(--primary)] text-[var(--primary)]' 
                    : 'border-transparent text-[var(--muted)] hover:text-white hover:border-[var(--border)]'
                  }
                `}
              >
                {t.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="px-6 py-5 border-b border-[var(--border)]">
                  <h2 className="text-lg font-semibold text-white">Descripción del Caso</h2>
                </div>
                <CardContent className="p-6">
                  {caseItem.description ? (
                    <p className="whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
                      {caseItem.description}
                    </p>
                  ) : (
                    <p className="text-[var(--muted)] italic">No se proporcionó una descripción para este caso.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
               <Card>
                <div className="px-6 py-5 border-b border-[var(--border)]">
                  <h2 className="text-lg font-semibold text-white">Detalles</h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)]">Fecha de Creación</p>
                    <p className="text-white mt-1 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(caseItem.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)]">Última Actualización</p>
                    <p className="text-white mt-1 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(caseItem.updated_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Placeholders para siguientes tareas */}
        {activeTab === 'payments' && (
          <PaymentsTab caseId={id} />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab caseId={id} />
        )}
        {activeTab === 'events' && (
          <EventsTab caseId={id} />
        )}
      </div>
    </div>
  )
}
