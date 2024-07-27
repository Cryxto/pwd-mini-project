export interface Coupon {
  id: number;
  code?: string | null;
  discount?: number | null;
  unit?: string | null;
  daysCouponAlive?: number | null;
  monthCouponAlive?: number | null;
  title?: string | null;
  description?: string | null;
  quota?: number | null;
  issuedBy?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface UsersCoupon {
  id: number;
  couponId?: number | null;
  expiredAt?: Date | null;
  userId?: number | null;
  refererId: number | null;
  relatedTransactionId?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  Coupon  ?: Coupon
}

export interface UsersPointHistory {
  id: number;
  points: number | null;
  expiredAt: Date | null;
  userId: number | null;
  userInvitedId: number | null;
  relatedTransactionId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface UserFromDBWithoutPassword {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string | null;
  referalCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface UserComplete extends UserFromDBWithoutPassword {
  UserPointHistory : UsersPointHistory[]
  UsersCoupon : UsersCoupon[]
}