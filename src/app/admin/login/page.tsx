import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <Logo className="mx-auto h-16 w-16" />
        <h1 className="mt-4 text-center text-2xl font-extrabold text-forest">Administration AJED</h1>
        <div className="mt-6"><LoginForm /></div>
      </div>
    </div>
  );
}
