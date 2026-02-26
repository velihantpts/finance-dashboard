import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastCheck = new Date();

      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Send initial heartbeat
      send(JSON.stringify({ type: 'connected' }));

      const interval = setInterval(async () => {
        try {
          const newNotifications = await prisma.notification.findMany({
            where: { userId, createdAt: { gt: lastCheck } },
            orderBy: { createdAt: 'desc' },
          });

          if (newNotifications.length > 0) {
            send(JSON.stringify({ type: 'notifications', data: newNotifications }));
            lastCheck = new Date();
          } else {
            send(JSON.stringify({ type: 'heartbeat' }));
          }
        } catch {
          // Connection may be closed
        }
      }, 5000);

      // Clean up on close
      const cleanup = () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      };

      // Auto-close after 5 minutes to prevent resource leak
      setTimeout(cleanup, 5 * 60 * 1000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
