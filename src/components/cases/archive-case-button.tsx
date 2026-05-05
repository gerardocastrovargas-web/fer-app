'use client'

import { useState, useTransition } from 'react'
import { Archive, X, AlertTriangle } from 'lucide-react'
import { archiveCaseAction } from '@/actions/cases'

interface ArchiveCaseButtonProps {
  caseId: string
  caseTitle: string
}

export function ArchiveCaseButton({ caseId, caseTitle }: ArchiveCaseButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await archiveCaseAction(caseId)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); setOpen(true) }}
        title="Archivar caso"
        className="p-1.5 rounded text-[var(--muted)] hover:text-amber-400 hover:bg-amber-400/10 transition-all"
      >
        <Archive className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />
          <div className="relative bg-[var(--surface-card)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Archivar caso</h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  ¿Deseas archivar el caso{' '}
                  <span className="font-medium text-white">"{caseTitle}"</span>?
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] leading-relaxed bg-white/[0.03] border border-[var(--border)] rounded-lg p-4">
              El caso dejará de aparecer en la lista activa. Podrás consultarlo en{' '}
              <span className="text-amber-400 font-medium">Archivo General</span>.
            </p>

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
