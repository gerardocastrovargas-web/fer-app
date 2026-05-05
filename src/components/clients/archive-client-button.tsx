'use client'

import { useState, useTransition } from 'react'
import { Archive, X, AlertTriangle } from 'lucide-react'
import { archiveClientAction } from '@/actions/clients'

interface ArchiveClientButtonProps {
  clientId: string
  clientName: string
  /** 'icon' shows only icon (for table rows), 'full' shows icon + label */
  variant?: 'icon' | 'full'
}

export function ArchiveClientButton({
  clientId,
  clientName,
  variant = 'full',
}: ArchiveClientButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await archiveClientAction(clientId)
      setOpen(false)
    })
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        title="Archivar cliente"
        className={
          variant === 'icon'
            ? 'p-1.5 rounded text-[var(--muted)] hover:text-amber-400 hover:bg-amber-400/10 transition-colors'
            : 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border)] text-[var(--muted)] rounded-md hover:border-amber-400/60 hover:text-amber-400 hover:bg-amber-400/5 transition-colors'
        }
      >
        <Archive className="w-4 h-4" />
        {variant === 'full' && <span>Archivar</span>}
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-[var(--surface-card)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon + title */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 id="archive-dialog-title" className="text-lg font-semibold text-white">
                  Archivar cliente
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  ¿Estás seguro de que deseas archivar a{' '}
                  <span className="font-medium text-white">{clientName}</span>?
                </p>
              </div>
            </div>

            {/* Body */}
            <p className="text-sm text-[var(--muted)] leading-relaxed bg-white/[0.03] border border-[var(--border)] rounded-lg p-4">
              El cliente dejará de aparecer en el directorio activo. Podrás consultarlo en la sección{' '}
              <span className="text-amber-400 font-medium">Archivo General</span>. Esta acción se puede
              revertir desde Supabase si es necesario.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium border border-[var(--border)] text-white rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Archivando…
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    Sí, archivar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
