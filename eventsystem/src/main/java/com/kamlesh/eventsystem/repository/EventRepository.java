package com.kamlesh.eventsystem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.kamlesh.eventsystem.entity.Event;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByLocationContainingIgnoreCase(String location, Pageable pageable);

Page<Event> findByEventDate(LocalDate eventDate, Pageable pageable);

Page<Event> findByLocationContainingIgnoreCaseAndEventDate(
        String location,
        LocalDate eventDate,
        Pageable pageable
);
}