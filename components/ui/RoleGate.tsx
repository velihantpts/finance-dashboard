'use client';

import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { hasPermission, type Permission } from '@/lib/rbac';

interface RoleGateProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export default function RoleGate({ children, permission, fallback = null }: RoleGateProps) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? 'viewer';

  if (!hasPermission(role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
