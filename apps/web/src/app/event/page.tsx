'use client';

import { Card } from '@/components/Card';
import Modal from '@/components/Modal';
import { EventInterface } from '@/interfaces/event.interface';
import { getAllEvent } from '@/server.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '@/stores/user/userContext';
import { FaCalendarCheck } from 'react-icons/fa';
import debounce from 'lodash.debounce';

const categories = [
  { id: 1, displayName: 'Music', name: 'music' },
  { id: 2, displayName: 'Art', name: 'art' },
  { id: 3, displayName: 'Technology', name: 'technology' },
  { id: 4, displayName: 'Sports', name: 'sports' },
  { id: 5, displayName: 'Food', name: 'food' },
  { id: 6, displayName: 'Education', name: 'education' },
];

export default function Page() {
  const [data, setData] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<EventInterface>();
  const [action, setAction] = useState<ReactNode[]>([]);
  const [searchParams, setSearchParams] = useState({
    category: '',
    location: '',
    title: '',
    content: '',
  });
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9); // Adjust the number of items per page as needed
  const router = useRouter();
  const { state } = useContext(UserContext);

  const handleData = useCallback(
    debounce(async (params) => {
      setLoading(true);
      const result = await getAllEvent(params);
      setData(result.data as unknown as EventInterface[]);
      setLoading(false);
    }, 500),
    [],
  );

  useEffect(() => {
    handleData(searchParams);
  }, [searchParams, state.user, handleData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to the first page on search change
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortData = (
    data: EventInterface[],
    criteria: string,
    order: string,
  ) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;
      switch (criteria) {
        case 'registrationStart':
          compareA = new Date(a.registrationStartedAt).getTime();
          compareB = new Date(b.registrationStartedAt).getTime();
          break;
        case 'registrationEnd':
          compareA = new Date(a.registrationClosedAt).getTime();
          compareB = new Date(b.registrationClosedAt).getTime();
          break;
        case 'quota':
          compareA = a.quota;
          compareB = b.quota;
          break;
        case 'registeredPersons':
          compareA = a.enrollment || 0;
          compareB = b.enrollment || 0;
          break;
        case 'eventHeld':
          compareA = new Date(a.heldAt).getTime();
          compareB = new Date(b.heldAt).getTime();
          break;
        default:
          return 0;
      }
      if (compareA > compareB) return order === 'asc' ? 1 : -1;
      if (compareA < compareB) return order === 'asc' ? -1 : 1;
      return 0;
    });
  };

  const sortedData = sortData(data, sortCriteria, sortOrder);

  // Pagination logic
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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
        <Link
          key="checkout"
          href={`/event/checkout/${event.slug}`}
          className="btn btn-primary"
        >
          Checkout
        </Link>,
      ]);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTop(); // Scroll to top when page changes
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pb-20 pt-10">
      <h1 className="text-4xl pb-10 font-bold">All Event</h1>
      <div className="flex flex-col mb-6">
        <div className="flex flex-col sm:flex-row">
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            className="input input-bordered mb-2"
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Search by location"
            className="input input-bordered mb-2"
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="content"
          placeholder="Search by content"
          className="input input-bordered mb-2"
          onChange={handleChange}
        />
        <select
          name="category"
          className="select select-bordered"
          onChange={handleChange}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row mb-6">
        <select
          className="select select-bordered mb-2"
          onChange={handleSortChange}
        >
          <option value="">Sort by</option>
          <option value="registrationStart">Registration Start</option>
          <option value="registrationEnd">Registration End</option>
          <option value="quota">Quota</option>
          <option value="registeredPersons">Registered Persons</option>
          <option value="eventHeld">Event Held</option>
        </select>
        <select className="select select-bordered" onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="flex flex-wrap max-w-full justify-center gap-5">
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : paginatedData.length === 0 ? (
          <div>No events found.</div>
        ) : (
          paginatedData.map((event) => (
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
                  {event.EventTransaction?.some(
                    (transaction) => transaction.attendeeId === state.user?.id,
                  ) ? (
                    <div className="badge badge-success gap-2">
                      <FaCalendarCheck />
                      Enrolled
                    </div>
                  ) : (
                    ''
                  )}
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

      <div className="flex justify-center mt-6">
        <button
          className="btn btn-primary mx-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary mx-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
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
