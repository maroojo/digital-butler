"use client";

import * as React from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthRole } from "@/types/portal";

type Props = {
  role: AuthRole;
  onSubmit: (payload: {
    username: string;
    password: string;
    role: AuthRole;
  }) => Promise<void>;
  loading: boolean;
  error: string;
};

export function PortalLoginCard({
  role,
  onSubmit,
  loading,
  error,
}: Props) {
  const [username, setUsername] = React.useState<string>(role);
  const [password, setPassword] = React.useState<string>("123456");

  return (
    <Card className="mx-auto w-full max-w-md rounded-[32px] border-sky-100 bg-white/95 shadow-[0_20px_80px_-40px_rgba(14,165,233,0.55)]">
      <CardContent className="p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
            {role === "owner" ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <UserCog className="h-6 w-6" />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-black text-sky-950">
              {role === "owner" ? "Owner Dashboard" : "Admin Back-office"}
            </h1>
            <p className="text-sm text-slate-500">
              ทดลองล็อกอินด้วย user:{role} / pass:123456
            </p>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit({
              username: username.trim(),
              password,
              role,
            });
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-2xl"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-2xl"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            disabled={loading}
            className="h-11 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}