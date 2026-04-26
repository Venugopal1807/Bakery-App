import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // SECURE GATE: Fetch secure user session object avoiding getSession spoofing
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Double down on verifying explicit Role within profiles map
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    // Attempted to access without admin privilege
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/10">
      <AdminSidebar className="w-64 border-r bg-card shrink-0 hidden md:block" />
      <div className="flex-1">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
    </div>
  );
}
