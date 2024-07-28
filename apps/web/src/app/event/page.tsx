'use client';

import { Card } from '@/components/Card';
import Modal from '@/components/Modal';
import { EventInterface } from '@/interfaces/event.interface';
import { getAllEvent } from '@/server.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from '@/stores/user/userContext';

export default function Page() {
  const [data, setData] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<EventInterface>();
  const [action, setAction] = useState<ReactNode[]>([]);
  const router = useRouter();
  const { state } = useContext(UserContext);

  useEffect(() => {
    async function handleData() {
      setLoading(true); // Start loading
      const data = await getAllEvent();
      setData(data.data as unknown as EventInterface[]);
      setLoading(false); // End loading
    }

    handleData();
  }, [state.user]);

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const handleOpenModal = (event: EventInterface) => {
    setModalOpen(true);
    router.prefetch(`/event/checkout/${event.slug}`);
    setModalData(event);

    const isUserEnrolled = event.EventTransaction?.some(
      (transaction) => transaction.attendeeId === state.user?.id,
    );

    if (isUserEnrolled) {
      setAction([
        <button key="enrolled" className="btn btn-disabled">
          Enrolled
        </button>,
      ]);
    } else {
      setAction([
        <Link key="checkout" href={`/event/checkout/${event.slug}`} className="btn btn-primary">
          Checkout
        </Link>,
      ]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pb-20 pt-10">
      <h1 className="text-4xl pb-10 font-bold">All Event</h1>
      <div className="flex flex-wrap max-w-full justify-center gap-5">
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          data.map((event) => (
            <Card key={event.id} theImage={event.media}>
              <div className="flex flex-col justify-between h-full">
                <h3 className="card-title font-extrabold">{event.title}</h3>
                <br />
                <div className="flex flex-wrap gap-2">
                  <div className="mb-2 badge badge-outline">
                    {event.basePrices.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </div>
                  <div className="mb-2 badge badge-neutral">
                    {`${event.quota} available`}
                  </div>
                  <div className="mb-2 badge badge-primary">
                    {`${event.enrollment || 0} registered`}
                  </div>
                  <div className="mb-2 badge badge-accent">
                    {event.Category.displayName}
                  </div>
                </div>
                <p className="my-2">{event.content.slice(0, 100)}...</p>
                <div className="card-actions justify-end mt-auto">
                  <button
                    className="btn btn-neutral"
                    onClick={() => handleOpenModal(event)}
                  >
                    Detail
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        id="event_modal"
        show={isModalOpen}
        onClose={() => setModalOpen(false)}
        actions={action}
      >
        <h3 className="card-title font-extrabold">{modalData?.title}</h3>
        <br />
        <div className="flex flex-wrap gap-2">
          <div className="mb-2 badge badge-outline">
            {modalData?.basePrices.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </div>
          <div className="mb-2 badge badge-accent">
            {modalData?.Category.displayName}
          </div>
          <div className="mb-2 badge badge-neutral">
            {`${modalData?.quota} available`}
          </div>
          <div className="mb-2 badge badge-primary">
            {`${modalData?.enrollment || 0} registered`}
          </div>
        </div>
        <p>{modalData?.content}</p>
        <div className="mt-4">
          <p>
            <strong>Event Type:</strong> {modalData?.eventType}
          </p>
          <p>
            <strong>Held At:</strong>{' '}
            {modalData?.heldAt && formatDate(new Date(modalData.heldAt))}
          </p>
          <p>
            <strong>Registration Starts:</strong>{' '}
            {modalData?.registrationStartedAt &&
              formatDate(new Date(modalData.registrationStartedAt))}
          </p>
          <p>
            <strong>Registration Ends:</strong>{' '}
            {modalData?.registrationClosedAt &&
              formatDate(new Date(modalData.registrationClosedAt))}
          </p>
          <p>
            <strong>Location:</strong> {modalData?.location}
          </p>
          <p>
            <strong>Location Link:</strong>{' '}
            <a
              href={modalData?.locationLink}
              target="_blank"
              className="text-blue-500 underline"
            >
              {modalData?.locationLink}
            </a>
          </p>
          <p>
            <strong>Quota:</strong> {modalData?.quota}
          </p>
        </div>
      </Modal>
    </div>
  );
}
