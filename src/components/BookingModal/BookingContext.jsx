import { createContext, useContext, useState, useCallback } from 'react';
import BookingModal from './BookingModal.jsx';

const BookingContext = createContext({ openBooking: () => {} });

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openBooking  = useCallback(() => setOpen(true),  []);
  const closeBooking = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal open={open} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}
