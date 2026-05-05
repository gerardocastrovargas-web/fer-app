'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCaseAction(formData: FormData) {
  const supabase = await createClient()
  
  const client_id = formData.get('client_id') as string
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  const { data, error } = await supabase
    .from('cases')
    .insert([{
      client_id,
      title,
      description,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/cases')
  revalidatePath(`/clients/${client_id}`)
  redirect(`/cases/${data.id}`)
}

export async function updateCaseStatusAction(id: string, newStatus: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('cases')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/cases/${id}`)
  revalidatePath('/cases')
}

export async function archiveCaseAction(id: string) {
  const supabase = await createClient()

  // Fetch client_id so we can revalidate the client detail page too
  const { data: caseData } = await supabase
    .from('cases')
    .select('client_id')
    .eq('id', id)
    .single()

  const { error: dataError } = await supabase
    .from('cases')
    .update({ is_archived: true })
    .eq('id', id)

  if (dataError) {
    throw new Error(dataError.message)
  }

  revalidatePath('/cases')
  revalidatePath(`/cases/${id}`)
  if (caseData?.client_id) {
    revalidatePath(`/clients/${caseData.client_id}`)
  }
  redirect('/cases')
}
