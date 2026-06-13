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

    // Validate file
    if (file == null || file.isEmpty()) {
        throw new RuntimeException("File is empty");
    }

    // Validate file size (5MB max)
    long maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.getSize() > maxFileSize) {
        throw new RuntimeException("File size exceeds maximum limit of 5MB");
    }

    // Validate file type
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
        throw new RuntimeException("File must be an image");
    }

    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    String uploadDir = "uploads/";
    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    Path filePath = Paths.get(uploadDir + fileName);
    System.out.println("📸 Uploading image for event " + eventId);
    System.out.println("📁 Full file path: " + filePath.toAbsolutePath());
    System.out.println("📎 File name: " + fileName);

    try {
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        System.out.println("✅ File written successfully to: " + filePath.toAbsolutePath());

        event.setImageUrl(fileName);
        eventRepository.save(event);
        System.out.println("✅ Image URL saved to database: " + fileName);

        return "Image uploaded successfully";
    } catch (IOException e) {
        System.out.println("❌ Failed to upload image: " + e.getMessage());
        throw new RuntimeException("Failed to upload image: " + e.getMessage());
    }
}

public Event updateEvent(Long id, Event updatedEvent) {
    Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    if (updatedEvent.getTitle() != null) {
        event.setTitle(updatedEvent.getTitle());
    }
    if (updatedEvent.getDescription() != null) {
        event.setDescription(updatedEvent.getDescription());
    }
    if (updatedEvent.getLocation() != null) {
        event.setLocation(updatedEvent.getLocation());
    }
    if (updatedEvent.getEventDate() != null) {
        event.setEventDate(updatedEvent.getEventDate());
    }
    if (updatedEvent.getPrice() != null) {
        event.setPrice(updatedEvent.getPrice());
    }
    if (updatedEvent.getCapacity() != null) {
        event.setCapacity(updatedEvent.getCapacity());
    }

    return eventRepository.save(event);
}

public byte[] getImageFile(String filename) throws IOException {
    Path filePath = Paths.get("uploads/" + filename);
    System.out.println("🔍 Attempting to load image: " + filePath.toAbsolutePath());
    System.out.println("📁 File exists: " + Files.exists(filePath));
    
    if (!Files.exists(filePath)) {
        System.out.println("❌ Image file not found: " + filePath.toAbsolutePath());
        throw new RuntimeException("Image not found: " + filename);
    }
    System.out.println("✅ Image loaded successfully: " + filename);
    return Files.readAllBytes(filePath);
}
}