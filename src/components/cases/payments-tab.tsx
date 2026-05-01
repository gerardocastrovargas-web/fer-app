import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign } from 'lucide-react'
import { addPaymentAction } from '@/actions/payments'
import { SubmitPaymentButton } from '@/components/ui/submit-button'
import { PaymentActions } from './payment-actions'

export default async function PaymentsTab({ caseId }: { caseId: string }) {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('case_id', caseId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  const addPaymentWithId = addPaymentAction.bind(null, caseId)

  // Calcs para stats falsos/reales
  const totalPaid = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const totalHonorarios = 15000; // Placeholder para coincidir con el diseño
  const saldoPendiente = totalHonorarios - totalPaid;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)]/50 flex items-center justify-between">
            <h2 className="text-2xl font-serif text-white">Historial de Pagos</h2>
            <button className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase px-3 py-1.5 border border-[var(--border)] rounded hover:bg-white/5 transition-colors">
              Ordenar por fecha
            </button>
          </div>
          <CardContent className="p-0">
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)]/50 bg-white/[0.02]">
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Monto</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Fecha</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Estado</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Notas</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 px-6 font-bold text-[var(--primary)]">
                          ${parseFloat(String(p.amount)).toLocaleString('es-MX')}
                        </td>
                        <td className="p-4 px-6 text-gray-300 text-sm">
                          {new Date(p.date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="p-4 px-6">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                            p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            p.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {p.status === 'paid' ? 'Pagado' : p.status === 'partial' ? 'Parcial' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-[var(--muted)] text-sm max-w-[200px] truncate">
                          {p.notes || '-'}
                        </td>
                        <td className="p-4 px-6 flex justify-end">
                          <PaymentActions paymentId={p.id} caseId={caseId} status={p.status} />
                        </td>
                      </tr>
                    ))}
                    {/* Fila vacía para rellenar visualmente */}
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)] italic border-t border-[var(--border)]/50">
                        No se registran más pagos pendientes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--muted)] italic border-t border-[var(--border)]/50">No hay pagos registrados.</div>
            )}
          </CardContent>
        </Card>

        {/* Cajas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <Card className="bg-[var(--surface-card)] border-[var(--border)] p-6">
            <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">Total de Honorarios</p>
            <p className="text-2xl font-bold text-[var(--primary)]">${totalHonorarios.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </Card>
          <Card className="bg-[var(--surface-card)] border-[var(--border)] p-6">
            <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">Total Pagado</p>
            <p className="text-2xl font-bold text-white">${totalPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </Card>
          <Card className="bg-[var(--surface-card)] border-l-2 border-l-[var(--primary)] border-y border-r border-[var(--border)] p-6">
            <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">Saldo Pendiente</p>
            <p className="text-2xl font-bold text-[var(--primary)]/90">${saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-[var(--surface-card)] border-[var(--border)]">
          <div className="px-6 py-5 border-b border-[var(--border)]/50 flex items-center gap-3">
            <div className="w-1 h-5 bg-[var(--primary)] rounded-full"></div>
            <h2 className="text-2xl font-serif text-white">Registrar Pago</h2>
          </div>
          <CardContent className="p-6">
            <form action={addPaymentWithId} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">Monto (MXN)</label>
                <input 
                  type="number" 
                  name="amount" 
                  step="0.01" 
                  min="0" 
                  required 
                  placeholder="1000" 
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">Estado</label>
                <select name="status" required className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors appearance-none">
                  <option value="pending">Pendiente</option>
                  <option value="partial">Parcial</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">Fecha</label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors calendar-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">Notas</label>
                <textarea name="notes" rows={3} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white resize-none focus:outline-none focus:border-[var(--primary)]/50 transition-colors" placeholder="Debe el pago aún pues no se ha firmado el contrato..." />
              </div>

              <button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors text-sm uppercase tracking-wider">
                <DollarSign className="w-4 h-4 mr-2" />
                Registrar Pago
              </button>
            </form>
          </CardContent>
        </Card>

        <div className="bg-[var(--background)] border border-[var(--border)] rounded-md p-4 flex gap-3 text-sm">
          <div className="text-[var(--primary)] shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </div>
          <p className="text-[var(--muted)] leading-relaxed">
            Al registrar este pago, se enviará automáticamente un recibo digital al correo de <span className="text-white font-medium">Ivan Sanchez</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
