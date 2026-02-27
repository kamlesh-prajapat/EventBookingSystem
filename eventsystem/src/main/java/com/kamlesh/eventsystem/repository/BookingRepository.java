package com.kamlesh.eventsystem.repository;

import com.kamlesh.eventsystem.entity.Booking;
import com.kamlesh.eventsystem.entity.Event;
import com.kamlesh.eventsystem.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByUserAndEvent(User user, Event event);
    List<Booking> findByUser(User user);
}