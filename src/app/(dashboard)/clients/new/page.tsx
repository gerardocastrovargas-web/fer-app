import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClientAction } from '@/actions/clients'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewClientPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <Link href="/clients" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a Clientes
        </Link>
        <div>
          <h1 className="text-section text-white mb-2">Nuevo Cliente</h1>
          <p className="text-subhead">Ingresa los datos de contacto y detalles.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <form action={createClientAction} className="space-y-6">
            <Input 
              label="Nombre Completo" 
              name="name" 
              required 
              placeholder="Ej. Juan Pérez" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Correo Electrónico" 
                name="email" 
                type="email" 
                placeholder="juan@ejemplo.com" 
              />
              <Input 
                label="Teléfono" 
                name="phone" 
                type="tel" 
                placeholder="55 1234 5678" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                className="w-full h-32 bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all disabled:opacity-50 resize-none"
                placeholder="Información adicional sobre el cliente..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border)]">
              <Link href="/clients">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" variant="primary">Guardar Cliente</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
