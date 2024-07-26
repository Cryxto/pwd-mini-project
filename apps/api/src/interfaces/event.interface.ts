import { $Enums } from '@prisma/client';

export interface EventInterface {
  id: number;
  organizerId: number | null;
  slug: string | null;
  content: string | null;
  eventType: $Enums.EventType | null;
  heldAt: Date | null;
  registrationStartedAt: Date | null;
  registrationClosedAt: Date | null;
  location : string | null
  locationLink : string | null
  quota : number | null
  base_prices : number | null
}
