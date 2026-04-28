import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DateInput } from '@/components/ui/date-input'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { addEventAction } from '@/actions/events'

export default async function EventsTab({ caseId }: { caseId: string }) {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('case_id', caseId)
    .eq('is_archived', false)
    .order('date', { ascending: true })

  const addEventWithId = addEventAction.bind(null, caseId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Agenda del Caso</h2>
          </div>
          <CardContent className="p-0">
            {events && events.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {events.map((e) => (
                  <li key={e.id} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--primary)]/10 flex flex-col items-center justify-center border border-[var(--primary)]/20 shrink-0">
                        <span className="text-[10px] font-bold text-[var(--primary)] uppercase leading-none mb-1">
                          {new Date(e.date).toLocaleDateString('es-MX', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-white leading-none">
                          {new Date(e.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{e.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant={e.type === 'hearing' ? 'danger' : e.type === 'deadline' ? 'warning' : 'default'}>
                            {e.type === 'hearing' ? 'Audiencia' : e.type === 'deadline' ? 'Fecha Límite' : 'Otro'}
                          </Badge>
                          <span className="text-xs text-[var(--muted)] flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(e.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {e.notes && <p className="text-sm text-[var(--muted)] mt-2">{e.notes}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">No hay eventos programados.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-white">Nuevo Evento</h2>
          </div>
          <CardContent className="p-6">
            <form action={addEventWithId} className="space-y-4">
              <Input 
                label="Título" 
                name="title" 
                required 
                placeholder="Ej. Audiencia Inicial" 
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">Tipo</label>
                <select name="type" required className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm">
                  <option value="hearing">Audiencia</option>
                  <option value="deadline">Fecha Límite</option>
                  <option value="other">Otro</option>
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
                    className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm calendar-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">Notas (Opcional)</label>
                <textarea name="notes" rows={2} className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm" placeholder="Ubicación, sala..." />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Agendar Evento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
