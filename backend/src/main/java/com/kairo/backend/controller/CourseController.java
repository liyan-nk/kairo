package com.kairo.backend.controller;

import com.kairo.backend.dto.response.CourseDetailResponse;
import com.kairo.backend.dto.response.CourseResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final SubjectService subjectService;

    public CourseController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getEnrolledCourses(@AuthenticationPrincipal UserPrincipal principal) {
        List<CourseResponse> courses = subjectService.getEnrolledCourses(principal.getId());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailResponse> getCourseDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID courseId
    ) {
        CourseDetailResponse courseDetail = subjectService.getCourseDetail(principal.getId(), courseId);
        return ResponseEntity.ok(courseDetail);
    }
}
