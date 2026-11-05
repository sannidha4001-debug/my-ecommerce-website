/**
 * Admin portal layout.
 *
 * Deliberately outside the public `(public)` route group: no marketing navbar,
 * no footer and a forced dark palette. The real guard is server-side role
 * checking plus RLS — see README and `supabase/migrations`.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-[#070714] text-slate-100 antialiased">
      {children}
    </div>
  );
}
