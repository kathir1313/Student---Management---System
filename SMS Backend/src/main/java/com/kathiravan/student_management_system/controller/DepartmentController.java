package com.kathiravan.student_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kathiravan.student_management_system.entity.Department;
import com.kathiravan.student_management_system.service.DepartmentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/departments")
@SecurityRequirement(name = "bearerAuth")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>>
    getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    @PostMapping
    public ResponseEntity<Department>
    addDepartment(
            @RequestBody Department department) {

        return ResponseEntity.status(
                HttpStatus.CREATED)
                .body(
                        departmentService
                                .addDepartment(department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department>
    getDepartmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService
                        .getDepartmentById(id));
    }
}
