'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Briefcase, CalendarDays, Clock } from 'lucide-react'

interface AgendaEvent {
  id: string
  title: string
  date: string
  type: string
  notes?: string | null
  case_id?: string | null
  cases?: { title: string }[] | null
}

interface AgendaCalendarProps {
  events: AgendaEvent[]
}

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const dayNames   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function typeLabel(type: string) {
  if (type === 'hearing')  return 'Audiencia'
  if (type === 'deadline') return 'Fecha Límite'
  return 'Personal'
}

function typeBadgeClass(type: string) {
  if (type === 'hearing')  return 'bg-red-500/15 text-red-400 border-red-500/25'
  if (type === 'deadline') return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
  return 'bg-blue-500/15 text-blue-400 border-blue-500/25'
}

export function AgendaCalendar({ events }: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth    = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const today = new Date()

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }

  // Build grid cells
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  // Events grouped by day-of-month for current month
  const eventsByDay = new Map<number, AgendaEvent[]>()
  events.forEach((e) => {
    const d = new Date(e.date)
    if (d.getUTCFullYear() === year && d.getUTCMonth() === month) {
      const day = d.getUTCDate()
      if (!eventsByDay.has(day)) eventsByDay.set(day, [])
      eventsByDay.get(day)!.push(e)
    }
  })

  const selectedEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : []

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[420px]">
      {/* ── Calendar grid ── */}
      <div className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white text-lg">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-[var(--muted)] hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-[var(--muted)] hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {dayNames.map((d) => (
            <div key={d} className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="h-10" />

            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year  === today.getFullYear()

            const dayEvts  = eventsByDay.get(day) ?? []
            const hasEvts  = dayEvts.length > 0
            const isSelected = day === selectedDay

            // Dot colors: red if any hearing, amber if deadline, blue if personal
            const hasCaseEvt   = dayEvts.some((e) => e.case_id)
            const hasPersonal  = dayEvts.some((e) => !e.case_id)

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`
                  h-10 w-full rounded-lg flex flex-col items-center justify-center text-sm relative transition-all
                  ${isSelected
                    ? 'bg-[var(--primary)] text-black font-bold ring-2 ring-[var(--primary)]/50'
                    : isToday
                    ? 'bg-emerald-500 text-black font-bold'
                    : hasEvts
                    ? 'bg-white/5 text-white hover:bg-white/10 font-medium'
                    : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'}
                `}
              >
                <span>{day}</span>
                {/* Dots */}
                {hasEvts && !isSelected && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {hasCaseEvt  && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                    {hasPersonal && <span className="w-1 h-1 rounded-full bg-blue-400"  />}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-[var(--muted)]">Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs text-[var(--muted)]">Eventos de caso</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-[var(--muted)]">Personales</span>
          </div>
        </div>
      </div>

      {/* ── Day detail panel ── */}
      <div
        className={`
          border-t lg:border-t-0 lg:border-l border-[var(--border)]
          transition-all duration-300 overflow-hidden
          ${selectedDay ? 'w-full lg:w-72 opacity-100' : 'w-full lg:w-0 opacity-0 pointer-events-none'}
        `}
      >
        {selectedDay && (
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">
                {selectedDay} de {monthNames[month]}
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[var(--muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <CalendarDays className="w-8 h-8 text-[var(--muted)] mb-3 opacity-40" />
                <p className="text-sm text-[var(--muted)]">Sin eventos este día</p>
              </div>
            ) : (
              <ul className="space-y-3 overflow-y-auto flex-1 pr-1">
                {selectedEvents.map((e) => (
                  <li
                    key={e.id}
                    className="bg-white/[0.04] border border-[var(--border)] rounded-lg p-3 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white leading-snug">{e.title}</p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border shrink-0 ${typeBadgeClass(e.type)}`}
                      >
                        {typeLabel(e.type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(e.date).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {e.case_id && e.cases && e.cases.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-amber-400/80">
                        <Briefcase className="w-3 h-3" />
                        <span className="truncate">{e.cases[0].title}</span>
                      </div>
                    )}

                    {e.notes && (
                      <p className="text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-1.5 mt-1">
                        {e.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
