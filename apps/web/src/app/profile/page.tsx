'use client';

import { useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const ProfilePage = () => {
  const { state } = useContext(UserContext);
  const user = state.user;

  if (!user) {
    return <span className="loading loading-spinner loading-xs"></span>;
  }

  return (
    <div className='flex flex-col justify-center items-center my-5'>
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="container mx-auto p-4">

        {/* User Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">User Information</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Full Name:</strong> {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Referral Code:</strong> {user.referalCode}</p>
            {/* <p><strong>Created At:</strong> {formatDate(new Date(user.createdAt))}</p> */}
          </div>
        </section>

        {/* Event Transactions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Event Transactions</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Event Type</th>
                  <th>Held At</th>
                  <th>Registration Start</th>
                  <th>Registration End</th>
                  <th>Base Price</th>
                  {/* <th>Status</th> */}
                </tr>
              </thead>
              <tbody>
                {user.EventTransaction.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.Event.title}</td>
                    <td>{transaction.Event.eventType}</td>
                    <td>{formatDate(new Date(transaction.Event.heldAt))}</td>
                    <td>{formatDate(new Date(transaction.Event.registrationStartedAt))}</td>
                    <td>{formatDate(new Date(transaction.Event.registrationClosedAt))}</td>
                    <td>{transaction.Event.basePrices.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    })}</td>
                    {/* <td>{transaction.status}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Available Coupons */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Coupons</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Unit</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {user.UsersCoupon.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>{coupon.couponId}</td>
                    <td>{coupon.Coupon?.discount} {coupon.Coupon?.unit}</td>
                    <td>{coupon.Coupon?.unit}</td>
                    <td>{formatDate(new Date(coupon.Coupon?.createdAt as unknown as string))}</td>
                    <td>{formatDate(new Date(coupon.expiredAt as unknown as string))}</td>
                    <td>{coupon.Coupon?.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Point History */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">User Point History</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Points</th>
                  <th>Expired At</th>
                  {/* <th>Related Transaction ID</th> */}
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {user.UserPointHistory.map((history) => (
                  <tr key={history.id}>
                    <td>{history.points}</td>
                    <td>{formatDate(new Date(history.expiredAt as unknown as string))}</td>
                    {/* <td>{history.relatedTransactionId}</td> */}
                    <td>{formatDate(new Date(history.createdAt as unknown as string))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
