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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Historial de Pagos</h2>
          </div>
          <CardContent className="p-0">
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-sm font-medium text-[var(--muted)]">
                      <th className="p-4 px-6 text-right">Monto</th>
                      <th className="p-4 px-6">Fecha</th>
                      <th className="p-4 px-6">Estado</th>
                      <th className="p-4 px-6">Notas</th>
                      <th className="p-4 px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 px-6 font-medium text-white text-right">
                          ${parseFloat(String(p.amount)).toLocaleString('es-MX')}
                        </td>
                        <td className="p-4 px-6 text-[var(--muted)] text-sm">
                          {new Date(p.date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="p-4 px-6">
                          <Badge variant={p.status === 'paid' ? 'success' : p.status === 'partial' ? 'warning' : 'default'}>
                            {p.status === 'paid' ? 'Pagado' : p.status === 'partial' ? 'Parcial' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="p-4 px-6 text-[var(--muted)] text-sm">
                          {p.notes || '-'}
                        </td>
                        <td className="p-4 px-6 flex justify-end">
                          <PaymentActions paymentId={p.id} caseId={caseId} status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">No hay pagos registrados.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-white">Registrar Pago</h2>
          </div>
          <CardContent className="p-6">
            <form action={addPaymentWithId} className="space-y-4">
              <Input 
                label="Monto (MXN)" 
                name="amount" 
                type="number" 
                step="0.01"
                min="0"
                required 
                placeholder="0.00" 
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">Estado</label>
                <select name="status" required className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm">
                  <option value="pending">Pendiente</option>
                  <option value="partial">Parcial</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>

              <Input 
                label="Fecha" 
                name="date" 
                type="date" 
                required 
                defaultValue={new Date().toISOString().split('T')[0]}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">Notas (Opcional)</label>
                <textarea name="notes" rows={2} className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm" placeholder="Referencia, banco..." />
              </div>

              <SubmitPaymentButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
