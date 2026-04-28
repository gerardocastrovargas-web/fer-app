'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addEventAction(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const eventDate = formData.get('event_date') as string
  const eventTime = formData.get('event_time') as string
  const notes = (formData.get('notes') as string) || null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  const dateData = new Date(`${eventDate}T${eventTime}`)

  const { error } = await supabase.from('events').insert([{
    case_id: caseId,
    title,
    type,
    date: dateData.toISOString(),
    notes,
    user_id: user.id
  }])

  if (error) throw new Error(error.message)
  
  revalidatePath(`/cases/${caseId}`)
  revalidatePath('/')
}

export async function deleteEventAction(eventId: string, caseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('events').update({ is_archived: true }).eq('id', eventId)
  if (error) throw new Error(error.message)
  
  revalidatePath(`/cases/${caseId}`)
  revalidatePath('/')
}
