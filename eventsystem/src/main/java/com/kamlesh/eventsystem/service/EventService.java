package com.kamlesh.eventsystem.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.kamlesh.eventsystem.entity.Event;
import com.kamlesh.eventsystem.repository.EventRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
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

    //get All Events
    public Page<Event> getEvents(
        int page,
        int size,
        String sortBy,
        String direction,
        String location,
        LocalDate date
) {

    Sort sort = direction.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() :
            Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    if (location != null && date != null) {
        return eventRepository
                .findByLocationContainingIgnoreCaseAndEventDate(location, date, pageable);
    }

    if (location != null) {
        return eventRepository
                .findByLocationContainingIgnoreCase(location, pageable);
    }

    if (date != null) {
        return eventRepository
                .findByEventDate(date, pageable);
    }

    return eventRepository.findAll(pageable);
}

public String uploadImage(Long eventId, MultipartFile file) throws IOException {

    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    String uploadDir = "uploads/";

    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

    Path filePath = Paths.get(uploadDir + fileName);

    Files.createDirectories(filePath.getParent());

    Files.write(filePath, file.getBytes());

    event.setImageUrl(fileName);
    eventRepository.save(event);

    return "Image uploaded successfully";
}
}