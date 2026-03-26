import type { AuthRole, AuthUser } from "@/types/portal";

export const mockUsers: Array<{
  username: string;
  password: string;
  role: AuthRole;
  displayName: string;
}> = [
  {
    username: "owner",
    password: "123456",
    role: "owner",
    displayName: "Building Owner",
  },
  {
    username: "admin",
    password: "123456",
    role: "admin",
    displayName: "Operations Admin",
  },
];

export function toAuthUser(username: string, role: AuthRole): AuthUser | null {
  const user = mockUsers.find((item) => item.username === username && item.role === role);
  if (!user) return null;

  return {
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  };
}
