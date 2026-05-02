'use client'

import { Bell, History } from 'lucide-react'
import { MobileNav } from '@/components/layout/mobile-nav'

export function Topbar() {
  return (
    <header className="h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <MobileNav />
        {/* Espacio reservado si se desea agregar otro elemento en el futuro */}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--muted)] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--muted)] transition-colors hidden md:flex">
          <History className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
