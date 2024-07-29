// stores/dashboard/dashboardInterfaces.ts

export interface Attendee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EventTransaction {
  id: number;
  eventId: number;
  attendeeId: number;
  review: string | null;
  media: string | null;
  ratings: number | null;
  attendedAt: string | null;
  paidAt: string;
  uniqueCode: string;
  finalPrices: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Attendee: Attendee | Attendee[];
}

export interface Event {
  attendee: any;
  id: number;
  organizerId: number;
  title: string;
  slug: string;
  content: string;
  eventType: string;
  categoryId: number;
  media: string;
  heldAt: string;
  registrationStartedAt: string;
  registrationClosedAt: string;
  location: string;
  locationLink: string;
  quota: number;
  basePrices: number;
  enrollment: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  EventTransaction: EventTransaction[] | EventTransaction;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  approvedAt: string;
  Event: Event[] | Event;
}

export interface DashboardInterface {
  Organization: Organization | null;
}

export type DashboardActionType =
  | {
      type: 'POPULATE';
      payload: Organization;
    }
  | {
      type: 'GET';
    };

export const initialDashboardState: DashboardInterface = {
  Organization: null,
};
