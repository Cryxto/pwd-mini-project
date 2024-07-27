'use client';

import { Card } from '@/components/Card';
import Modal from '@/components/Modal';
import { EventInterface } from '@/interfaces/event.interface';
import { getAllEvent } from '@/server.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<EventInterface>();
  const [action, setAction] = useState<ReactNode[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function handleData() {
      setLoading(true); // Start loading
      const data = await getAllEvent();
      setData(data.data as unknown as EventInterface[]);
      setLoading(false); // End loading
    }

    handleData();
  }, []);

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

  return (
    <div className="flex flex-col justify-center items-center pb-20 pt-10">
      <h1 className="text-4xl pb-10 font-bold">All Event</h1>
      <div className="flex flex-wrap max-w-full justify-center gap-5">
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          data.map((e) => (
            <Card key={e.id} theImage={e.media}>
              <div className="flex flex-col justify-between h-full">
                <h3 className="card-title font-extrabold">{e.title}</h3>
                <br />
                <div className="flex flex-wrap gap-2">
                  <div className="mb-2 badge badge-outline">
                    {e.basePrices.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </div>
                  <div className="mb-2 badge badge-neutral">
                    {`${e.quota} available`}
                  </div>
                  <div className="mb-2 badge badge-primary">
                    {`${e.enrollment || 0} registered`}
                  </div>
                  <div className="mb-2 badge badge-accent">
                    {e.Category.displayName}
                  </div>
                </div>
                <p className="my-2">{e.content.slice(0, 100)}...</p>
                <div className="card-actions justify-end mt-auto">
                  <button
                    className="btn btn-neutral"
                    onClick={() => {
                      setModalOpen(true);
                      router.prefetch(`/event/checkout/${e.slug}`);
                      setModalData(e);
                      setAction([
                        <Link
                          key="checkout"
                          href={`/event/checkout/${e.slug}`}
                          className="btn btn-primary"
                        >
                          Checkout
                        </Link>,
                      ]);
                    }}
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
