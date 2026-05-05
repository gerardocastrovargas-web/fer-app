'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPaymentAction(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const amount = formData.get('amount') as string
  const date = formData.get('date') as string
  const notes = (formData.get('notes') as string) || null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  // Fetch total_fee and existing paid amounts to auto-derive status
  const { data: caseData } = await supabase
    .from('cases')
    .select('total_fee')
    .eq('id', caseId)
    .single()

  const { data: existingPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('case_id', caseId)
    .eq('is_archived', false)

  const totalPaidSoFar = existingPayments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0
  const newTotal = totalPaidSoFar + parseFloat(amount)
  const totalFee = Number(caseData?.total_fee ?? 0)

  let status = 'partial'
  if (totalFee > 0 && newTotal >= totalFee) status = 'paid'
  else if (totalFee === 0) status = 'partial'

  const { error } = await supabase.from('payments').insert([{
    case_id: caseId,
    amount: parseFloat(amount),
    status,
    date: date || new Date().toISOString().split('T')[0],
    notes,
    user_id: user.id
  }])

  if (error) throw new Error(error.message)

  revalidatePath(`/cases/${caseId}`)
  revalidatePath('/')
}

export async function deletePaymentAction(paymentId: string, caseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('payments').update({ is_archived: true }).eq('id', paymentId)
  if (error) throw new Error(error.message)

  revalidatePath(`/cases/${caseId}`)
  revalidatePath('/')
}

export async function updatePaymentStatusAction(paymentId: string, caseId: string, newStatus: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('payments').update({ status: newStatus }).eq('id', paymentId)
  if (error) throw new Error(error.message)

  revalidatePath(`/cases/${caseId}`)
  revalidatePath('/')
}

export async function updateTotalFeeAction(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const total_fee = parseFloat(formData.get('total_fee') as string)

  if (isNaN(total_fee) || total_fee < 0) throw new Error('Monto inválido')

  const { error } = await supabase
    .from('cases')
    .update({ total_fee })
    .eq('id', caseId)

  if (error) throw new Error(error.message)

  revalidatePath(`/cases/${caseId}`)
}
