package com.kamlesh.eventsystem.service;

import org.springframework.stereotype.Service;

import com.kamlesh.eventsystem.dto.AdminDashboardStats;
import com.kamlesh.eventsystem.repository.BookingRepository;
import com.kamlesh.eventsystem.repository.EventRepository;
import com.kamlesh.eventsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AdminService {
     private final EventRepository eventRepository;
      private final BookingRepository bookingRepository;
  private final UserRepository userRepository;

     //for admin stats
    public AdminDashboardStats getDashboardStats() {

    AdminDashboardStats stats = new AdminDashboardStats();

    stats.setTotalUsers(userRepository.count());
    stats.setTotalEvents(eventRepository.count());
    stats.setTotalBookings(bookingRepository.count());

    double revenue = bookingRepository.findAll()
            .stream()
            .filter(b -> b.getStatus().name().equals("CONFIRMED"))
            .mapToDouble(b -> b.getEvent().getPrice())
            .sum();

    stats.setTotalRevenue(revenue);

    return stats;
}
}
