import { prisma } from './prisma';

export async function logAudit(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
