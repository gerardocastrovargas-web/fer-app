'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { DollarSign, Loader2 } from 'lucide-react'

export function SubmitPaymentButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="primary" className="w-full mt-2" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Registrando...
        </>
      ) : (
        <>
          <DollarSign className="w-4 h-4 mr-2" />
          Registrar Pago
        </>
      )}
    </Button>
  )
}
