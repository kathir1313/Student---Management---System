package com.kathiravan.student_management_system.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kathiravan.student_management_system.dto.StudentDTO;
import com.kathiravan.student_management_system.service.StudentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.CrossOrigin;


import jakarta.validation.Valid;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5174")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ================= CRUD =================

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                studentService.getStudentById(id));
    }

    @PostMapping
    public ResponseEntity<StudentDTO> addStudent(
            @Valid @RequestBody StudentDTO dto) {

        StudentDTO savedStudent = studentService.addStudent(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedStudent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO dto) {

        return ResponseEntity.ok(
                studentService.updateStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.ok(
                "Student Deleted Successfully");
    }

    // ================= PATCH =================

    @PatchMapping("/{id}")
    public ResponseEntity<StudentDTO> partialUpdateStudent(
            @PathVariable Long id,
            @RequestBody StudentDTO dto) {

        return ResponseEntity.ok(
                studentService.partialUpdateStudent(id, dto));
    }

    // ================= COUNT =================

    @GetMapping("/count")
    public ResponseEntity<Long> countStudents() {

        return ResponseEntity.ok(
                studentService.countStudents());
    }

    // ================= SEARCH =================

    @GetMapping("/email/{email}")
    public ResponseEntity<StudentDTO> getStudentByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                studentService.getStudentByEmail(email));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<StudentDTO>> getStudentsByName(
            @PathVariable String name) {

        return ResponseEntity.ok(
                studentService.getStudentsByName(name));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<StudentDTO>> getStudentsByDepartment(
            @PathVariable String department) {

        return ResponseEntity.ok(
                studentService.getStudentsByDepartment(department));
    }

    // ================= FILTER =================

    @GetMapping("/filter")
    public ResponseEntity<List<StudentDTO>> filterStudents(
            @RequestParam String department) {

        return ResponseEntity.ok(
                studentService.filterByDepartment(department));
    }

    // ================= PAGINATION + SORTING =================

    @GetMapping("/pagination")
    public ResponseEntity<Page<StudentDTO>> getStudentsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "id") String sortBy) {

        return ResponseEntity.ok(
                studentService.getStudentsWithPagination(
                        page,
                        size,
                        sortBy));
    }

    // ================= DYNAMIC SORTING =================

    @GetMapping("/sort")
    public ResponseEntity<List<StudentDTO>> getStudentsSorted(

            @RequestParam String field,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                studentService.getStudentsSorted(
                        field,
                        direction));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentDTO>> searchStudents(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                studentService.searchStudents(keyword));
    }
}