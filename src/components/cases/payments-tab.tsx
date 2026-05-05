import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Pencil } from 'lucide-react'
import { addPaymentAction, updateTotalFeeAction } from '@/actions/payments'
import { PaymentActions } from './payment-actions'

export default async function PaymentsTab({ caseId }: { caseId: string }) {
  const supabase = await createClient()

  // Fetch case to get total_fee
  const { data: caseData } = await supabase
    .from('cases')
    .select('total_fee')
    .eq('id', caseId)
    .single()

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('case_id', caseId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  const addPaymentWithId    = addPaymentAction.bind(null, caseId)
  const updateTotalFeeWithId = updateTotalFeeAction.bind(null, caseId)

  const totalFee    = Number(caseData?.total_fee ?? 0)
  const totalPaid   = payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0
  const faltante    = Math.max(0, totalFee - totalPaid)
  const progressPct = totalFee > 0 ? Math.min(100, (totalPaid / totalFee) * 100) : 0
  const isPaidFull  = totalFee > 0 && totalPaid >= totalFee

  const fmt = (n: number) =>
    n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* ── Left column: stats + table ── */}
      <div className="xl:col-span-2 space-y-6">

        {/* Progress card */}
        <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)]/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Estado de Honorarios</h2>
              {isPaidFull && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  LIQUIDADO
                </span>
              )}
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.03] border border-[var(--border)] rounded-lg p-4">
                <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">
                  Total Honorarios
                </p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {totalFee > 0 ? `$${fmt(totalFee)}` : <span className="text-sm text-[var(--muted)] font-normal">Sin definir</span>}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-[var(--border)] rounded-lg p-4">
                <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">
                  Total Abonado
                </p>
                <p className="text-2xl font-bold text-emerald-400">${fmt(totalPaid)}</p>
              </div>
              <div className={`rounded-lg p-4 border ${faltante > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                <p className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-2">
                  Faltante
                </p>
                <p className={`text-2xl font-bold ${faltante > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {totalFee > 0 ? `$${fmt(faltante)}` : '—'}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {totalFee > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Progreso de pago</span>
                  <span className="font-bold text-white">{progressPct.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isPaidFull ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>${fmt(totalPaid)} pagado</span>
                  <span>${fmt(faltante)} restante</span>
                </div>
              </div>
            )}

            {totalFee === 0 && (
              <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-400/80">
                  Define el total de honorarios pactado para activar el seguimiento de faltante y la barra de progreso.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payments history table */}
        <Card className="bg-[var(--surface-card)] border-[var(--border)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)]/50">
            <h2 className="text-lg font-semibold text-white">Historial de Abonos</h2>
          </div>
          <CardContent className="p-0">
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)]/50 bg-white/[0.02]">
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Abono</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Fecha</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Estado</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">Notas</th>
                      <th className="p-4 px-6 text-xs font-bold tracking-wider text-[var(--muted)] uppercase text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 px-6">
                          <span className="font-bold text-[var(--primary)] text-lg">
                            ${fmt(Number(p.amount))}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-gray-300 text-sm">
                          {new Date(p.date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="p-4 px-6">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                            p.status === 'paid'    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            p.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                     'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {p.status === 'paid' ? 'Pagado' : p.status === 'partial' ? 'Parcial' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-[var(--muted)] text-sm max-w-[200px] truncate">
                          {p.notes || '—'}
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
              <div className="p-12 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                  <DollarSign className="w-7 h-7" />
                </div>
                <p className="text-[var(--muted)]">No hay abonos registrados aún.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Right column: forms ── */}
      <div className="space-y-6">

        {/* Set total fee */}
        <Card className="bg-[var(--surface-card)] border-[var(--border)]">
          <div className="px-6 py-5 border-b border-[var(--border)]/50 flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-base font-semibold text-white">Honorarios Pactados</h2>
          </div>
          <CardContent className="p-6">
            <form action={updateTotalFeeWithId} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Total acordado (MXN)
                </label>
                <input
                  type="number"
                  name="total_fee"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={totalFee > 0 ? totalFee : ''}
                  placeholder="Ej. 15000"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)]/10 font-bold py-2.5 px-4 rounded-md flex items-center justify-center transition-colors text-sm"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {totalFee > 0 ? 'Actualizar honorarios' : 'Definir honorarios'}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Register payment/abono */}
        <Card className="bg-[var(--surface-card)] border-[var(--border)]">
          <div className="px-6 py-5 border-b border-[var(--border)]/50 flex items-center gap-3">
            <div className="w-1 h-5 bg-[var(--primary)] rounded-full" />
            <h2 className="text-base font-semibold text-white">Registrar Abono</h2>
          </div>
          <CardContent className="p-6">
            <form action={addPaymentWithId} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Cantidad Abonada (MXN)
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="Ej. 5000"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
                {totalFee > 0 && (
                  <p className="text-xs text-[var(--muted)]">
                    Faltante actual:{' '}
                    <span className={`font-bold ${faltante > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      ${fmt(faltante)}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors calendar-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Notas <span className="normal-case text-[var(--muted)] font-normal">(opcional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-white resize-none focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  placeholder="Transferencia, efectivo, cheque..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors text-sm uppercase tracking-wider"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Registrar Abono
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
