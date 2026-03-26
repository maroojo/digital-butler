import { cookies } from "next/headers";
import { mockUsers, toAuthUser } from "@/server/mocks/users";
import type { AuthRole, AuthUser } from "@/types/portal";

const AUTH_COOKIE = "hc_portal_auth";

export async function login(username: string, password: string, role: AuthRole): Promise<AuthUser> {
  const user = mockUsers.find(
    (item) => item.username === username && item.password === password && item.role === role,
  );

  if (!user) {
    throw new Error("Invalid username, password, or role");
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, JSON.stringify({ username: user.username, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return {
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  };
}

export async function logout() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get(AUTH_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { username: string; role: AuthRole };
    return toAuthUser(parsed.username, parsed.role);
  } catch {
    return null;
  }
}

export async function requireRole(role: AuthRole): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== role) {
    throw new Error("Unauthorized");
  }
  return user;
}
