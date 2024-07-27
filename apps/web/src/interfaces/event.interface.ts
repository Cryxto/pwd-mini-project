export interface EventInterface {
  id: number
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
  Organizer : OrganizationInterface;
  Category : Category 
}

export interface OrganizationInterface {
  id: number;
  name: string;
  description: string;
  ownerId: number;
}

export interface Category {
  id : number,
  name : string
  displayName : string
}