'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPaymentAction(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const amount = formData.get('amount') as string
  const status = formData.get('status') as string
  const date = formData.get('date') as string
  const notes = (formData.get('notes') as string) || null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  const { error } = await supabase.from('payments').insert([{
    case_id: caseId,
    amount: parseFloat(amount),
    status,
    date: date || new Date().toISOString().split('T')[0],
    notes,
    user_id: user.id
  }])

  if (error) throw new Error(error.message)
  
  // Revalidate to update tabs and dashboard
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
