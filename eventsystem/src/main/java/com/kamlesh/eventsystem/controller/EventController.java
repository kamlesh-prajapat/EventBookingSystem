package com.kamlesh.eventsystem.controller;

import com.kamlesh.eventsystem.entity.Event;
import com.kamlesh.eventsystem.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    //get All Events
    @GetMapping
public Page<Event> getAllEvents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size,
        @RequestParam(defaultValue = "eventDate") String sortBy,
        @RequestParam(defaultValue = "asc") String direction,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
) {

    return eventService.getEvents(page, size, sortBy, direction, location, date);
}
    // 👑 ADMIN only
    @PostMapping("/create")
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    // 👥 Everyone logged-in
    @GetMapping("/all")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
public Optional<Event> getEventById(@PathVariable Long id) {
    return eventService.getEventById(id);
}

    @DeleteMapping("/{id}")
public String deleteEvent(@PathVariable Long id) {
    eventService.deleteEvent(id);
    return "Event deleted successfully";
}
}