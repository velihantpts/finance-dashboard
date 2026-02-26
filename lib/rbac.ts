export type Role = 'admin' | 'analyst' | 'viewer';

export type Permission =
  | 'transaction:create'
  | 'transaction:update'
  | 'transaction:delete'
  | 'transaction:view'
  | 'report:export'
  | 'report:schedule'
  | 'settings:manage'
  | 'profile:edit'
  | 'user:manage';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'transaction:create', 'transaction:update', 'transaction:delete', 'transaction:view',
    'report:export', 'report:schedule', 'settings:manage', 'profile:edit', 'user:manage',
  ],
  analyst: [
    'transaction:create', 'transaction:update', 'transaction:view',
    'report:export', 'profile:edit',
  ],
  viewer: [
    'transaction:view', 'report:export',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'analyst': return 'Analyst';
    case 'viewer': return 'Viewer';
    default: return role;
  }
}
