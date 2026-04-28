export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid items-center justify-center bg-[var(--surface)] px-4">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  )
}
