import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, UploadCloud } from 'lucide-react'
import { uploadDocumentAction } from '@/actions/documents'
import DownloadButton from './download-button'

export default async function DocumentsTab({ caseId }: { caseId: string }) {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', caseId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  const uploadActionWithId = uploadDocumentAction.bind(null, caseId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Archivos del Caso</h2>
          </div>
          <CardContent className="p-0">
            {documents && documents.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {documents.map((doc) => (
                  <li key={doc.id} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-shrink-0 items-center justify-center text-[var(--muted)]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{doc.file_name}</p>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          {new Date(doc.created_at).toLocaleDateString('es-MX')} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <DownloadButton fileUrl={doc.file_url} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">No hay documentos subidos.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-white">Subir Archivo</h2>
            <p className="text-xs text-[var(--muted)] mt-1">Límite de 50MB por archivo</p>
          </div>
          <CardContent className="p-6">
            <form action={uploadActionWithId} className="space-y-4">
              <label className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent">
                <UploadCloud className="w-8 h-8 text-[var(--muted)] mb-3" />
                <span className="text-sm font-medium text-white text-center">Haz clic para seleccionar</span>
                <span className="text-xs text-[var(--muted)] text-center mt-1">PDF, Word, Excel, Imágenes</span>
                <input type="file" name="file" className="sr-only" required />
              </label>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Subir Documento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
