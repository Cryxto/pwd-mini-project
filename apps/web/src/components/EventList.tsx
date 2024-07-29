// components/EventList.tsx
'use client';

import { useContext, useState } from 'react';
import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import Modal from '@/components/Modal';
import { Event } from '@/stores/dashboard/dashboardAnnotation';

interface ModalContentProps {
  event: Event;
  type: 'attendees' | 'transactions';
}

const ModalContent = ({ event, type }: ModalContentProps) => {
  if (type === 'attendees') {
    const attendees = Array.isArray(event.EventTransaction)
      ? event.EventTransaction.flatMap(tx => tx.Attendee)
      : [event.EventTransaction.Attendee].flat();

    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Attendees for {event.title}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr key={attendee.id}>
                  <td>{attendee.firstName} {attendee.lastName}</td>
                  <td>{attendee.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'transactions') {
    const transactions = Array.isArray(event.EventTransaction)
      ? event.EventTransaction
      : [event.EventTransaction];

    return (
      <div className='max-w-full w-full'>
        <h2 className="text-xl font-bold mb-2">Transactions for {event.title}</h2>
        <div className="">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.uniqueCode}</td>
                  <td>{transaction.finalPrices}</td>
                  <td>{new Date(transaction.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

const EventList = () => {
  const { state } = useContext(DashboardContext);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalType, setModalType] = useState<'attendees' | 'transactions' | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleModalClose = () => {
    setSelectedEvent(null);
    setModalType(null);
  };

  const openModal = (event: Event, type: 'attendees' | 'transactions') => {
    setSelectedEvent(event);
    setModalType(type);
  };

  const events = Array.isArray(state.Organization?.Event)
    ? state.Organization?.Event
    : state.Organization?.Event ? [state.Organization?.Event] : [];

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.heldAt);
    if (startDate && endDate) {
      return eventDate >= startDate && eventDate <= endDate;
    }
    return true;
  });

  return (
    <div className='overflow-x-auto'>
      <div className="mb-4 flex flex-col sm:flex-row items-center">
        <div className="form-control w-full sm:w-1/4 mb-2 sm:mb-0">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>
        <div className="form-control w-full sm:w-1/4 mb-2 sm:mb-0 sm:ml-2">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.eventType}</td>
                <td>{new Date(event.heldAt).toLocaleDateString()}</td>
                <td className='flex flex-wrap gap-2'>
                  <button className="btn btn-sm" onClick={() => openModal(event, 'attendees')}>View Attendees</button>
                  <button className="btn btn-sm" onClick={() => openModal(event, 'transactions')}>View Transactions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEvent && modalType && (
        <Modal id="event-modal" show={!!selectedEvent} onClose={handleModalClose}>
          <ModalContent event={selectedEvent} type={modalType} />
        </Modal>
      )}
    </div>
  );
};

export default EventList;
