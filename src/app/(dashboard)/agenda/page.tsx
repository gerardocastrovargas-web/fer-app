import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DateInput } from '@/components/ui/date-input'
import { Calendar, Clock, Briefcase, Plus, CalendarDays } from 'lucide-react'
import { AgendaCalendar } from '@/components/agenda/agenda-calendar'
import { addGlobalEventAction, deleteGlobalEventAction } from '@/actions/events'

export const metadata = {
  title: 'Agenda General | CaseLedger',
  description: 'Gestiona tus eventos personales y de casos en un solo lugar.',
}

export default async function AgendaPage() {
  const supabase = await createClient()

  // Todos los eventos activos — personales y de casos
  const { data: allEvents } = await supabase
    .from('events')
    .select('id, title, date, type, notes, case_id, cases(title)')
    .eq('is_archived', false)
    .order('date', { ascending: true })

  // Separamos los del mes actual hacia adelante para la lista
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const upcomingEvents = (allEvents ?? []).filter(
    (e) => new Date(e.date).toISOString() >= startOfToday
  )

  const pastEvents = (allEvents ?? []).filter(
    (e) => new Date(e.date).toISOString() < startOfToday
  )

  function typeLabel(type: string) {
    if (type === 'hearing')  return 'Audiencia'
    if (type === 'deadline') return 'Fecha Límite'
    return 'Personal'
  }

  function typeBadgeVariant(type: string): 'danger' | 'warning' | 'default' {
    if (type === 'hearing')  return 'danger'
    if (type === 'deadline') return 'warning'
    return 'default'
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Agenda General</h1>
          <p className="text-[var(--muted)]">
            Visualiza y gestiona todos tus eventos — de casos y personales — en un solo lugar.
          </p>
        </div>
      </div>

      {/* ── Main grid: Calendar + New Event form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Calendar (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-white">Calendario</h2>
              <span className="ml-auto text-xs text-[var(--muted)]">
                Haz clic en un día para ver los eventos
              </span>
            </div>
            <AgendaCalendar events={allEvents ?? []} />
          </Card>
        </div>

        {/* New event form (1 col) */}
        <div>
          <Card className="bg-[var(--surface-card)] border-[var(--border)]">
            <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-white">Nuevo Evento</h2>
            </div>
            <CardContent className="p-6">
              <form action={addGlobalEventAction} className="space-y-4">
                <Input
                  label="Título"
                  name="title"
                  required
                  placeholder="Ej. Reunión con cliente"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">Tipo</label>
                  <select
                    name="type"
                    required
                    className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                  >
                    <option value="other">Personal</option>
                    <option value="hearing">Audiencia</option>
                    <option value="deadline">Fecha Límite</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">Fecha</label>
                    <DateInput name="event_date" required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">Hora</label>
                    <input
                      name="event_time"
                      type="time"
                      required
                      defaultValue="09:00"
                      className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm calendar-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Notas <span className="text-[var(--muted)]">(opcional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                    placeholder="Ubicación, detalles..."
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Evento
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Upcoming events list ── */}
      <Card className="bg-[var(--surface-card)] border-[var(--border)]">
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-semibold text-white">Próximos Eventos</h2>
          <span className="ml-auto text-xs font-medium text-[var(--muted)] bg-white/5 px-2.5 py-1 rounded-full border border-[var(--border)]">
            {upcomingEvents.length}
          </span>
        </div>
        <CardContent className="p-0">
          {upcomingEvents.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]/60">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-5 px-6 py-4 hover:bg-white/[0.03] transition-colors group">
                  {/* Date badge */}
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[var(--primary)] uppercase leading-none mb-0.5">
                      {new Date(e.date).toLocaleDateString('es-MX', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-white leading-none">
                      {new Date(e.date).getUTCDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">{e.title}</p>
                      <Badge variant={typeBadgeVariant(e.type)}>
                        {typeLabel(e.type)}
                      </Badge>
                      {!e.case_id && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                          Personal
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(e.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {e.case_id && e.cases && Array.isArray(e.cases) && e.cases.length > 0 && (
                        <span className="flex items-center gap-1 text-amber-400/70">
                          <Briefcase className="w-3 h-3" />
                          {(e.cases as { title: string }[])[0].title}
                        </span>
                      )}
                      {e.notes && <span className="truncate max-w-[200px]">{e.notes}</span>}
                    </div>
                  </div>

                  {/* Delete (only for global events — case events delete from case page) */}
                  {!e.case_id && (
                    <form action={deleteGlobalEventAction.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-red-400 transition-all p-1.5 rounded hover:bg-red-400/10"
                        title="Eliminar evento"
                      >
                        <span className="sr-only">Eliminar</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Sin eventos próximos</h3>
              <p className="text-[var(--muted)]">Usa el formulario de arriba para agendar tu primer evento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Past events (collapsible summary) ── */}
      {pastEvents.length > 0 && (
        <Card className="bg-[var(--surface-card)] border-[var(--border)] opacity-60">
          <div className="px-6 py-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--muted)]">
              Eventos pasados ({pastEvents.length})
            </h2>
          </div>
        </Card>
      )}
    </div>
  )
}
