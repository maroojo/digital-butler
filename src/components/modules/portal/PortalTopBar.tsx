"use client";

import { Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/types/portal";

export function PortalTopBar({ user, title, subtitle, onLogout }: { user: AuthUser; title: string; subtitle: string; onLogout: () => Promise<void> }) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-sky-100 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-sky-950 md:text-3xl">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-sky-900">
          {user.displayName} · {user.role}
        </div>
        <Button variant="outline" className="rounded-2xl border-sky-200" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}
