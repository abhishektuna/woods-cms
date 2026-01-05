import type{ UserRole } from "./roleUtils";

export function canAccess(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}
