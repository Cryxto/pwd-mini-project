import prisma from '@/prisma';

class EventRepository {
  async allEvent(category?: string): Promise<{
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
  async singleEvent(slug:string): Promise<{
    ok: boolean;
    error?: any;
    data?: object | null;
  }> {
    try {
      if (!slug || slug === undefined || slug ==='') {
        return {
          ok: false,
          error : 'param cannot be empty'
        }
      }
      const event = await prisma.event.findUnique({
        where : {
          slug : slug
        }, include: {
          Organizer: true,
          Category: true
        }
      });
      return {
        ok: true,
        data: event,
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
