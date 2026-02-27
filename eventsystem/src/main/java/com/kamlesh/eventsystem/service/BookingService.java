package com.kamlesh.eventsystem.service;

import com.kamlesh.eventsystem.entity.*;
import com.kamlesh.eventsystem.model.BookingStatus;
import com.kamlesh.eventsystem.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

  
    public List<Booking> getBookingsByUser(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return bookingRepository.findByUser(user);
}

   @Transactional
public Booking createBooking(String email, Long eventId) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    if (bookingRepository.existsByUserAndEvent(user, event)) {
        throw new RuntimeException("Already booked");
    }

    if (event.getAvailableSeats() <= 0) {
        throw new RuntimeException("No seats available");
    }

    event.setAvailableSeats(event.getAvailableSeats() - 1);
    eventRepository.save(event);

    Booking booking = new Booking();
    booking.setUser(user);
    booking.setEvent(event);
    booking.setStatus(BookingStatus.CONFIRMED);

    return bookingRepository.save(booking);
}

//cancel booking
@Transactional
public String cancelBooking(Long bookingId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() == BookingStatus.CANCELLED) {
        throw new RuntimeException("Already cancelled");
    }

    Event event = booking.getEvent();

    event.setAvailableSeats(event.getAvailableSeats() + 1);
    eventRepository.save(event);

    booking.setStatus(BookingStatus.CANCELLED);
    bookingRepository.save(booking);

    return "Booking cancelled successfully";
}
}