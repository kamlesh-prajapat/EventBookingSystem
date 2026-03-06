package com.kamlesh.eventsystem.controller;

import com.kamlesh.eventsystem.entity.Booking;
import com.kamlesh.eventsystem.service.BookingService;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    @GetMapping("/my")
public List<Booking> myBookings(Authentication authentication) {
    String email = authentication.getName();
    return bookingService.getBookingsByUser(email);
}

 @GetMapping
public List<Booking> getAllBookings(Authentication authentication) {
    String email = authentication.getName();

    return bookingService.getAllBookings(email);
}

   @PostMapping
public Booking bookEvent(@RequestParam Long eventId,
                         Authentication authentication) {
System.out.println(authentication);
    String email = authentication.getName();

    return bookingService.createBooking(email, eventId);
}


@PutMapping("/cancel")
public String cancelBooking(@RequestParam Long bookingId) {
    return bookingService.cancelBooking(bookingId);
}
}