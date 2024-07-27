import prisma from '@/prisma';

class EventRepository {
  async allEvent(): Promise<{
    ok: boolean;
    error?: any;
    data?: object | null;
  }> {
    try {
      const events = await prisma.event.findMany({
        include: {
          Organizer: true,
          Category: true
        },
      });
      return {
        ok: true,
        data: events,
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }
}

export const eventRepository = new EventRepository();
