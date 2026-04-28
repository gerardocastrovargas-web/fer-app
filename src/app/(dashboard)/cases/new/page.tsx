import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createCaseAction } from '@/actions/cases'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewCasePage(props: { searchParams: Promise<{ clientId?: string }> }) {
  const searchParams = await props.searchParams
  const preselectedClientId = searchParams.clientId || ''
  const supabase = await createClient()

  // Fetch only active clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('is_archived', false)
    .order('name', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <Link href="/cases" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a Casos
        </Link>
        <div>
          <h1 className="text-section text-white mb-2">Nuevo Caso</h1>
          <p className="text-subhead text-[var(--muted)]">Ingresa los detalles para el nuevo asunto legal.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <form action={createCaseAction} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select 
                name="client_id" 
                required
                defaultValue={preselectedClientId}
                className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
              >
                <option value="" disabled>Selecciona un cliente...</option>
                {clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {(!clients || clients.length === 0) && (
                <p className="text-xs text-amber-500 mt-1">Debes tener al menos un cliente creado primero.</p>
              )}
            </div>

            <Input 
              label="Título del Caso" 
              name="title" 
              required 
              placeholder="Ej. Divorcio Administrativo - García" 
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Descripción / Detalles
              </label>
              <textarea
                name="description"
                className="w-full h-32 bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all disabled:opacity-50 resize-none"
                placeholder="Hechos, anotaciones, o descripción general..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border)]">
              <Link href="/cases">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" variant="primary" disabled={!clients || clients.length === 0}>
                Crear Caso
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
