'use client';
import { EventInterface } from '@/interfaces/event.interface';
import { getSingleEvent } from '@/server.actions';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { UserContext } from '@/stores/user/userContext';
import { UserComplete, UsersCoupon } from '@/interfaces/user.interface';

export default function Page() {
  const [data, setData] = useState<EventInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<UsersCoupon | null>(
    null,
  );
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const param = useParams<{ slug: string }>();
  const { state } = useContext(UserContext);
  const userData: UserComplete | null = state.user as UserComplete;

  useEffect(() => {
    async function handleData() {
      setLoading(true); // Start loading
      const response = await getSingleEvent(param.slug);
      setData(response.data as EventInterface);
      setLoading(false); // End loading
    }

    handleData();
  }, [param.slug]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmPurchase = () => {
    // Handle the purchase logic here
    console.log('Purchase confirmed');
    handleCloseModal();
  };

  const availableCoupons =
    userData?.UsersCoupon?.filter(
      (coupon) =>
        coupon.Coupon?.issuedBy === data?.organizerId ||
        coupon.Coupon?.issuedBy === 1,
    ) || [];

  const userPoints =
    userData?.UserPointHistory?.reduce(
      (acc, pointHistory) => acc + (pointHistory.points || 0),
      0,
    ) || 0;

  const totalPrice = calculateTotalPrice(
    data?.basePrices || 0,
    selectedCoupon,
    usePoints ? userPoints : 0,
  );

  return (
    <div className="flex flex-col items-center mx-4 my-20">
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>
          <div className="flex flex-wrap w-full justify-center items-center">
            <div className="w-full sm:w-1/2 p-4 border border-gray-200 rounded-md">
              <h2 className="block font-bold mb-2">{data?.title}</h2>
              <p>{data?.content || 'No content available'}</p>
              <div className="mt-4">
                <label className="block font-bold mb-2">Use Coupon</label>
                <select
                  className="select select-bordered w-full mb-4"
                  onChange={(e) =>
                    setSelectedCoupon(
                      availableCoupons.find(
                        (coupon) => coupon.id === Number(e.target.value),
                      ) || null,
                    )
                  }
                >
                  <option value="">Select a coupon</option>
                  {availableCoupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.Coupon?.title} - {coupon.Coupon?.discount}{' '}
                      {coupon.Coupon?.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    disabled={userPoints === 0}
                  />
                  Use Points ({userPoints.toLocaleString('id-ID')})
                </label>
              </div>
              <div className="mt-4 text-2xl">
                <p>
                  Total:{' '}
                  {totalPrice.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </p>
              </div>
              <div className="mt-4 max-w-full justify-end flex">
                <button
                  className="btn btn-primary self-end "
                  onClick={handleOpenModal}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
          <Modal
            id="checkout-modal"
            show={isModalOpen}
            onClose={handleCloseModal}
            actions={[
              <button
                key="confirm"
                className="btn btn-primary"
                onClick={handleConfirmPurchase}
              >
                Confirm
              </button>,
              <button key="cancel" className="btn" onClick={handleCloseModal}>
                Cancel
              </button>,
            ]}
          >
            <h2 className="text-xl font-bold">Confirm Purchase</h2>
            <p>Event: {data?.title || 'No title available'}</p>
            <p>
              Price:{' '}
              {totalPrice.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
              })}
            </p>
            <p>
              Date:{' '}
              {data?.heldAt
                ? new Date(data.heldAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'No date available'}
            </p>
            <p>Location: {data?.location || 'No location available'}</p>
          </Modal>
        </>
      )}
    </div>
  );
}

// utils/calculateTotalPrice.ts
function calculateTotalPrice(
  basePrice: number,
  coupon: UsersCoupon | null,
  points: number,
): number {
  let discount = 0;

  if (coupon) {
    if (coupon.Coupon?.unit === 'percent') {
      discount = (basePrice * (coupon.Coupon.discount || 0)) / 100;
    } else if (coupon.Coupon?.unit === 'amount') {
      discount = coupon.Coupon.discount || 0;
    }
  }

  const discountedPrice = basePrice - discount;
  const finalPrice = Math.max(discountedPrice - points, 0);

  return finalPrice;
}
