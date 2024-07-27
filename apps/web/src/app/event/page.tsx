'use client';

import { Card } from '@/components/Card';
import Modal from '@/components/Modal';
import { EventInterface } from '@/interfaces/event.interface';
import { getAllEvent } from '@/server.actions';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<EventInterface>();

  useEffect(() => {
    async function handleData() {
      setLoading(true); // Start loading
      const data = await getAllEvent();
      console.log(data);
      setData(data.data as unknown as EventInterface[]);
      setLoading(false); // End loading
    }

    handleData();
  }, []);

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
                  <div className="mb-2 badge badge-primary">
                    {e.Category.displayName}
                  </div>
                </div>
                <p>{e.content.slice(0, 100)}...</p>
                <div className="card-actions justify-end mt-auto">
                  <button
                    className="btn btn-neutral"
                    onClick={() => {
                      setModalOpen(true);
                      setModalData(e);
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
        // closeButton={false}
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
          <div className="mb-2 badge badge-primary">
            {modalData?.Category.displayName}
          </div>
        </div>
        <p>{modalData?.content}</p>
      </Modal>
    </div>
  );
}
