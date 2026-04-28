'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadDocumentAction(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File

  if (!file || file.size === 0) {
    throw new Error('No file provided')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found')

  // Generate a unique file path: caseId/timestamp_filename
  const fileName = `${Date.now()}_${file.name}`
  const filePath = `${caseId}/${fileName}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // Generate Public URL (assuming the bucket is properly authenticated, we store the full path to retrieve it later)
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)
    
  // Since our bucket is private (as created in SQL: public false)
  // we cannot use getPublicUrl directly for downloading, but we store the internal path instead.
  // Actually, we should store `filePath` in `file_url`, so we can generate signed URLs later.

  // Save metadata to documents table
  const { error: dbError } = await supabase.from('documents').insert([{
    case_id: caseId,
    user_id: user.id,
    file_url: filePath,
    file_name: file.name,
    file_type: file.type || 'application/octet-stream',
    file_size: file.size
  }])

  if (dbError) {
    // Ideally, we should clean up the uploaded file here
    await supabase.storage.from('documents').remove([filePath])
    throw new Error(dbError.message)
  }

  revalidatePath(`/cases/${caseId}`)
}

export async function getDocumentDownloadUrl(filePath: string) {
  const supabase = await createClient()
  // Generate a signed URL valid for 60 seconds
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 60)

  if (error) {
    throw new Error(error.message)
  }

  return data.signedUrl
}
