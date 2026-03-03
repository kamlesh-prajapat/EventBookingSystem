package com.kamlesh.eventsystem.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kamlesh.eventsystem.dto.AdminDashboardStats;
import com.kamlesh.eventsystem.service.AdminService;
import com.kamlesh.eventsystem.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final EventService eventService;
   
    @GetMapping("/dashboard")
  public AdminDashboardStats getStats() {
    return adminService.getDashboardStats();
  }

    @PostMapping("/{id}/upload-image")
public String uploadEventImage(@PathVariable Long id,
                               @RequestParam("file") MultipartFile file) throws IOException {

    return eventService.uploadImage(id, file);
}
}