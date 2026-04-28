'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { getDocumentDownloadUrl } from '@/actions/documents'
import { Button } from '@/components/ui/button'

export default function DownloadButton({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      const signedUrl = await getDocumentDownloadUrl(fileUrl)
      window.open(signedUrl, '_blank')
    } catch (e) {
      console.error(e)
      alert("Error al descargar el archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
      {loading ? 'Generando...' : 'Descargar'}
    </Button>
  )
}
