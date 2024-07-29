'use client';

import { useContext, useState } from 'react';
import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import Modal from '@/components/Modal';
import { Event, EventTransaction, Attendee } from '@/stores/dashboard/dashboardAnnotation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        <h2 className="text-xl font-bold">Attendees for {event.title}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee: Attendee) => (
                <tr key={attendee.id}>
                  <td>{attendee.id}</td>
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
      <div>
        <h2 className="text-xl font-bold">Transactions for {event.title}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Unique Code</th>
                <th>Final Price</th>
                <th>Date Paid</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: EventTransaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleModalClose = () => {
    setSelectedEvent(null);
    setModalType(null);
  };

  const openModal = (event: Event, type: 'attendees' | 'transactions') => {
    setSelectedEvent(event);
    setModalType(type);
  };

  // Filter events based on date range
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
    <>
      <div className="mb-4 flex space-x-2">
        <DatePicker
          selected={startDate || undefined} // Convert null to undefined
          onChange={date => setStartDate(date as Date)}
          selectsStart
          startDate={startDate || undefined} // Convert null to undefined
          endDate={endDate || undefined} // Convert null to undefined
          placeholderText="Start Date"
          className="input input-bordered"
        />
        <DatePicker
          selected={endDate || undefined} // Convert null to undefined
          onChange={date => setEndDate(date as Date)}
          selectsEnd
          startDate={startDate || undefined} // Convert null to undefined
          endDate={endDate || undefined} // Convert null to undefined
          placeholderText="End Date"
          className="input input-bordered"
        />
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
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.eventType}</td>
                <td>{new Date(event.heldAt).toLocaleDateString()}</td>
                <td>
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
    </>
  );
};

export default EventList;
