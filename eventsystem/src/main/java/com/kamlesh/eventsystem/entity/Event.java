package com.kamlesh.eventsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private Integer availableSeats;

    private String description;

    private String imageUrl;

    @NotBlank(message = "Location is required")
    private String location;

    @Future(message = "Event date must be in future")
    private LocalDate eventDate;

    @Positive(message = "Price must be positive")
    private Double price;
}