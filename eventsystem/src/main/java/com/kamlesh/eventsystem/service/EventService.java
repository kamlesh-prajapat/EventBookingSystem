package com.kamlesh.eventsystem.service;

import com.kamlesh.eventsystem.entity.Event;
import com.kamlesh.eventsystem.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

  public Event createEvent(Event event) {

    event.setAvailableSeats(event.getCapacity());

    return eventRepository.save(event);
}

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public void deleteEvent(Long id) {
      eventRepository.deleteById(id);
    }

    public Optional<Event> getEventById(Long id) {
       return eventRepository.findById(id);
    }
}