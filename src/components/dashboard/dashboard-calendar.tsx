'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  type: string
}

interface DashboardCalendarProps {
  events: Event[]
}

export function DashboardCalendar({ events }: DashboardCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const today = new Date()

  // Generate grid cells
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-[var(--muted)] hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-[var(--muted)] hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs font-medium text-[var(--muted)] py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8" />
          }

          const isToday = 
            day === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()

          // Check if there's an event on this day
          const dayEvents = events.filter(e => {
            const eventDate = new Date(e.date)
            // Adjust for local timezone to ensure events appear on the correct visual day
            return eventDate.getUTCDate() === day && 
                   eventDate.getUTCMonth() === currentDate.getMonth() && 
                   eventDate.getUTCFullYear() === currentDate.getFullYear()
          })

          const hasEvents = dayEvents.length > 0

          return (
            <div 
              key={day} 
              className={`h-8 w-8 mx-auto rounded-full flex flex-col items-center justify-center text-sm relative group cursor-default transition-colors ${
                isToday ? 'bg-emerald-500 text-black font-bold' : 
                hasEvents ? 'bg-amber-500/20 text-amber-500 font-medium hover:bg-amber-500/30' : 
                'text-[var(--muted)] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{day}</span>
              
              {/* Event indicators dot */}
              {hasEvents && !isToday && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500" />
              )}
              {hasEvents && isToday && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-black/50" />
              )}

              {/* Tooltip for events */}
              {hasEvents && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#222] border border-[var(--border)] rounded-md p-2 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="text-xs font-semibold text-white mb-1 border-b border-white/10 pb-1">Eventos del día</p>
                  <ul className="text-left space-y-1">
                    {dayEvents.map(e => (
                      <li key={e.id} className="text-xs text-[var(--muted)] truncate">
                        • {e.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[var(--border)] px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-[var(--muted)]">Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500/20 flex items-center justify-center relative">
            <div className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-[2px]" />
          </div>
          <span className="text-xs text-[var(--muted)]">Con eventos</span>
        </div>
      </div>
    </div>
  )
}
