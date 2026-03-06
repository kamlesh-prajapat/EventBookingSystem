package com.kamlesh.eventsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * EventDTO - For returning event data to frontend
 * Excludes unnecessary data to reduce payload size
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDate eventDate;
    private Integer capacity;
    private Integer availableSeats;
    private Double price;
    private String imageUrl;
}
