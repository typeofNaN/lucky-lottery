export function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-xl">
      {message}
    </div>
  )
}
