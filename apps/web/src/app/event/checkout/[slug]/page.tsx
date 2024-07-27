'use client';
import { EventInterface } from '@/interfaces/event.interface';
import { getSingleEvent } from '@/server.actions';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { UserContext } from '@/stores/user/userContext';

export default function Page() {
  const [data, setData] = useState<EventInterface>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const param = useParams<{ slug: string }>();
  const { state, dispatch } = useContext(UserContext);
  // const [userData, setUserData] = useState<UserStateInterface>();

  useEffect(() => {
    async function handleData() {
      setLoading(true); // Start loading
      const data = await getSingleEvent(param.slug);

      // console.log(data);
      
      
      setData(data.data as unknown as EventInterface);
      // setUserData(state)
      
      // console.log(userData);
      setLoading(false); // End loading
    }

    handleData();
  }, [param.slug, dispatch]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col items-center mx-4 my-20">
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>
          <div className="flex flex-wrap w-full justify-center items-center">
            <div className="w-full sm:w-1/2 p-4 border border-gray-200 rounded-md">
              <p>{data?.content}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={handleOpenModal}
              >
                Buy Ticket
              </button>
            </div>
            <div className="w-full sm:w-1/2 p-4 border border-gray-200 rounded-md">
              <p>{data?.content}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={handleOpenModal}
              >
                Buy Ticket
              </button>
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
                onClick={handleCloseModal}
              >
                Confirm
              </button>,
              <button key="cancel" className="btn" onClick={handleCloseModal}>
                Cancel
              </button>,
            ]}
          >
            <h2 className="text-xl font-bold">Confirm Purchase</h2>
            <p>{state.user?.firstName}</p>
            <p>Are you sure you want to buy a ticket for this event?</p>
          </Modal>
        </>
      )}
    </div>
  );
}
