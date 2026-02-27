package com.kamlesh.eventsystem.controller;

import com.kamlesh.eventsystem.entity.Event;
import com.kamlesh.eventsystem.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

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