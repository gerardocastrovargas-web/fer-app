'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = (formData.get('email') as string) || null
  const phone = (formData.get('phone') as string) || null
  const notes = (formData.get('notes') as string) || null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  const { data, error } = await supabase
    .from('clients')
    .insert([{
      name,
      email,
      phone,
      notes,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/clients')
  redirect(`/clients/${data.id}`)
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = (formData.get('email') as string) || null
  const phone = (formData.get('phone') as string) || null
  const notes = (formData.get('notes') as string) || null

  const { error } = await supabase
    .from('clients')
    .update({ name, email, phone, notes })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}

export async function archiveClientAction(id: string) {
  const supabase = await createClient()

  // 1. Archivar todos los casos del cliente en cascada
  const { error: casesError } = await supabase
    .from('cases')
    .update({ is_archived: true })
    .eq('client_id', id)
    .eq('is_archived', false)

  if (casesError) {
    throw new Error(casesError.message)
  }

  // 2. Archivar al cliente
  const { error } = await supabase
    .from('clients')
    .update({ is_archived: true })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/clients')
  revalidatePath('/cases')
  redirect('/clients')
}
