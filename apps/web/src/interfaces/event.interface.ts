export interface EventInterface {
  id: number;
  title: string;
  slug: string;
  content: string;
  eventType: string;
  categoryId: number;
  heldAt: Date;
  registrationStartedAt: Date;
  registrationClosedAt: Date;
  location: string;
  locationLink: string;
  quota: string;
  basePrices: number;
  enrollment: number;
  organizerId: number;
  media: string;
  Organizer: OrganizationInterface;
  Category: Category;
  EventTransaction : EventTransactionResult[] | null | undefined
}

export interface OrganizationInterface {
  id: number;
  name: string;
  description: string;
  ownerId: number;
}

export interface Category {
  id: number;
  name: string;
  displayName: string;
}

export interface EventTransactionResult {
  id: number;
  eventId: number | null;
  attendeeId: number | null;
  review: string | null;
  media: string | null;
  ratings: number | null;
  attendedAt: Date | null;
  paidAt: Date | null;
  uniqueCode: string | null;
  finalPrices: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
