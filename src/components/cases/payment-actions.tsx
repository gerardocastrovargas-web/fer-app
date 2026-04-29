'use client'

import { useTransition } from 'react'
import { CheckCircle, Trash2, Loader2 } from 'lucide-react'
import { deletePaymentAction, updatePaymentStatusAction } from '@/actions/payments'

interface PaymentActionsProps {
  paymentId: string
  caseId: string
  status: string
}

export function PaymentActions({ paymentId, caseId, status }: PaymentActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      await updatePaymentStatusAction(paymentId, caseId, 'paid')
    })
  }

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      startTransition(async () => {
        await deletePaymentAction(paymentId, caseId)
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status !== 'paid' && (
        <button
          onClick={handleMarkAsPaid}
          disabled={isPending}
          className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-md transition-colors disabled:opacity-50"
          title="Marcar como Pagado"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
        title="Eliminar Pago"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
