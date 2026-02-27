package com.kamlesh.eventsystem.repository;

import com.kamlesh.eventsystem.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}