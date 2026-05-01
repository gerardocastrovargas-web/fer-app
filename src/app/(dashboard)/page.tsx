import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Briefcase, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { DashboardCalendar } from '@/components/dashboard/dashboard-calendar'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Total Clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('is_archived', false)

  // 2. Fetch Active Cases
  const { count: activeCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('is_archived', false)

  // 3. Fetch Pending Payments
  const { data: pendingPaymentsData } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'pending')
    .eq('is_archived', false)
  const totalPendingPayments = pendingPaymentsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0

  // 4. Fetch Upcoming Events
  const today = new Date().toISOString()
  const { count: upcomingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('date', today)
    .eq('is_archived', false)

  const stats = [
    { name: 'TOTAL CLIENTES', value: totalClients || 0, sub: '+1 esta semana', icon: Users, isGold: false },
    { name: 'CASOS ACTIVOS', value: activeCases || 0, sub: 'Sin retrasos', icon: Briefcase, isGold: false },
    { name: 'PAGOS PENDIENTES', value: `$${totalPendingPayments.toLocaleString('es-MX')}`, sub: 'Vence en 3 días', icon: DollarSign, isGold: true },
    { name: 'PRÓXIMOS EVENTOS', value: upcomingEvents || 0, sub: 'Agenda libre hoy', icon: Calendar, isGold: false },
  ]

  // Casos recientes
  const { data: recentCases } = await supabase
    .from('cases')
    .select('id, title, status, created_at')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // Eventos para el calendario (Todo este mes y futuros)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString()
  
  const { data: nextEvents } = await supabase
    .from('events')
    .select('id, title, date, type')
    .gte('date', firstDayOfMonth)
    .eq('is_archived', false)
    .order('date', { ascending: true })
    .limit(100)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[var(--muted)]">Resumen de tu actividad y estado general.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className="bg-[var(--surface-card)] border-[var(--border)] p-6 flex flex-col justify-between h-40">
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase">{stat.name}</p>
                <div className="w-8 h-8 rounded bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className={`text-4xl font-bold mb-1 ${stat.isGold ? 'text-[var(--primary)]' : 'text-white'}`}>{stat.value}</p>
                <p className="text-xs text-[var(--muted)]">{stat.sub}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Casos Recientes (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]/50">
            <h2 className="text-2xl font-serif text-white">Casos Recientes</h2>
            <Link href="/cases" className="text-sm font-medium text-[var(--primary)] hover:underline">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            {recentCases && recentCases.length > 0 ? (
              recentCases.map((c) => (
                <div key={c.id} className="bg-[var(--surface-card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-[var(--primary)] border border-[var(--border)]">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{c.title}</p>
                        <p className="text-xs text-[var(--muted)]">ID: EXP-2026-0{c.id.toString().substring(0,3)}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      c.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-white/5 text-[var(--muted)] border-[var(--border)]'
                    }`}>
                      {c.status === 'active' ? 'Activo' : 
                       c.status === 'in_progress' ? 'En Progreso' : 
                       c.status === 'closed' ? 'Cerrado' : 'Archivado'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-[10px] text-[var(--muted)] font-bold tracking-wider uppercase mb-1">Cliente</p>
                      <p className="text-sm text-gray-300">Cliente Asignado</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--muted)] font-bold tracking-wider uppercase mb-1">Última Actualización</p>
                      <p className="text-sm text-gray-300">{new Date(c.created_at).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[var(--muted)] border border-[var(--border)] rounded-xl">No hay casos registrados.</div>
            )}
          </div>
        </div>

        {/* Eventos Próximos (Calendario) (Takes 1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]/50">
            <h2 className="text-2xl font-serif text-white">Calendario</h2>
            <Link href="/" className="text-sm font-medium text-[var(--primary)] hover:underline">Abrir Agenda</Link>
          </div>
          <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
            <DashboardCalendar events={nextEvents || []} />
          </Card>
        </div>
      </div>
    </div>
  )
}
