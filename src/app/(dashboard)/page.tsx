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
    { name: 'Total Clientes', value: totalClients || 0, icon: Users, color: 'text-blue-500' },
    { name: 'Casos Activos', value: activeCases || 0, icon: Briefcase, color: 'text-emerald-500' },
    { name: 'Pagos Pendientes', value: `$${totalPendingPayments.toLocaleString('es-MX')}`, icon: DollarSign, color: 'text-amber-500' },
    { name: 'Próximos Eventos', value: upcomingEvents || 0, icon: Calendar, color: 'text-purple-500' },
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
    <div className="space-y-12">
      <div>
        <h1 className="text-section text-white mb-2">Dashboard</h1>
        <p className="text-subhead">Resumen de tu actividad y estado general.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className="bg-[var(--surface-card)]">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--muted)] mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Casos Recientes */}
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Casos Recientes</h2>
            <Link href="/cases" className="text-sm text-[var(--primary)] hover:underline">Ver todos</Link>
          </div>
          <CardContent className="p-0">
            {recentCases && recentCases.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {recentCases.map((c) => (
                  <li key={c.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-white">{c.title}</p>
                      <p className="text-sm text-[var(--muted)]">{new Date(c.created_at).toLocaleDateString('es-MX')}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.status === 'active' ? 'bg-[var(--success)]/20 text-emerald-400' :
                      c.status === 'in_progress' ? 'bg-[var(--warning)]/20 text-amber-400' :
                      'bg-white/10 text-white'
                    }`}>
                      {c.status === 'active' ? 'Activo' : 
                       c.status === 'in_progress' ? 'En Progreso' : 
                       c.status === 'closed' ? 'Cerrado' : 'Archivado'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">No hay casos registrados.</div>
            )}
          </CardContent>
        </Card>

        {/* Eventos Próximos (Calendario) */}
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-white">Calendario de Eventos</h2>
          </div>
          <CardContent className="p-0">
            <DashboardCalendar events={nextEvents || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
