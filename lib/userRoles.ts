export const ROLES = [
  { value: "super_admin",       label: "Super Admin",       color: "bg-purple-100 text-purple-800" },
  { value: "marketing_manager", label: "Marketing Manager", color: "bg-blue-100 text-blue-800" },
  { value: "sales",             label: "Sales",             color: "bg-green-100 text-green-800" },
  { value: "editor",            label: "Editor",            color: "bg-yellow-100 text-yellow-800" },
  { value: "hr",                label: "HR",                color: "bg-pink-100 text-pink-800" },
  { value: "admin",             label: "Admin (legacy)",    color: "bg-gray-100 text-gray-800" },
] as const;

export type RoleValue = (typeof ROLES)[number]["value"];

export function getRoleLabel(role: string): string {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

export function getRoleColor(role: string): string {
  return ROLES.find((r) => r.value === role)?.color ?? "bg-gray-100 text-gray-800";
}

export function isSuperAdmin(role: string): boolean {
  return role === "super_admin" || role === "admin";
}
