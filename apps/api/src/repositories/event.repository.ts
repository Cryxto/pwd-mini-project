import bcrypt from 'bcrypt';
import prisma from '@/prisma';
import { randomString } from '@/utils/string.utils';
import { setDateNowAndAddMonth } from '@/utils/date.utils';

class EventRepository {
  async createEvent(record: any) {
    try {
      const events = await prisma.event.findFirst({where: {id:1}})
    } catch (error) {
      return {
        
      };
    }
  }

  
}

export const authRepository = new EventRepository();
