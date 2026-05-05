'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, Archive, LogOut, Scale, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: CalendarDays },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Casos', href: '/cases', icon: Briefcase },
  { name: 'Archivo', href: '/archive', icon: Archive },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 h-20 flex items-center border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3 w-full">
          {/* Logo Graphic (3 squares) */}
          <div className="flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="16" y="4" width="20" height="20" stroke="#94A3B8" strokeWidth="3" opacity="0.8"/>
              <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="3" className="text-[var(--primary)]"/>
              <rect x="4" y="16" width="20" height="20" stroke="white" strokeWidth="3"/>
              
              {/* Inner small brackets if needed, but the squares themselves are the main identity */}
            </svg>
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-[15px] font-bold tracking-[0.15em] text-white uppercase">
              Valenzuela
            </span>
            <span className="text-[11px] font-bold tracking-[0.1em] text-[var(--primary)] uppercase">
              & Asociados
            </span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors relative ${
                isActive 
                  ? 'bg-[var(--surface-elevated)] text-white font-medium' 
                  : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)]" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--primary)]' : ''}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-2 py-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center border border-[var(--border)]">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex flex-shrink-0 items-center justify-center text-[var(--primary)] font-medium text-sm">
              AB
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Lic. Abogado</p>
            <p className="text-xs text-[var(--muted)] truncate">PREMIUM ACCOUNT</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-[var(--radius-md)] text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
