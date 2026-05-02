'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, Archive, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Casos', href: '/cases', icon: Briefcase },
  { name: 'Archivo', href: '/archive', icon: Archive },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--muted)] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--surface)] flex flex-col">
          <div className="h-16 border-b border-[var(--border)] flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* Logo Graphic */}
              <div className="flex-shrink-0">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="16" y="4" width="20" height="20" stroke="#94A3B8" strokeWidth="3" opacity="0.8"/>
                  <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="3" className="text-[var(--primary)]"/>
                  <rect x="4" y="16" width="20" height="20" stroke="white" strokeWidth="3"/>
                </svg>
              </div>
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[13px] font-bold tracking-[0.15em] text-white uppercase">
                  Valenzuela
                </span>
                <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--primary)] uppercase">
                  & Asociados
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--muted)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[var(--radius-md)] transition-colors ${
                    isActive 
                      ? 'bg-[var(--surface-elevated)] text-white font-medium border border-[var(--primary)]/20' 
                      : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[var(--primary)]' : ''}`} />
                  <span className="text-lg">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-6 border-t border-[var(--border)]">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-[var(--radius-md)] text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors text-base font-medium"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
