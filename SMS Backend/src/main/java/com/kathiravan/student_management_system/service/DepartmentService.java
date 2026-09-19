package com.kathiravan.student_management_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kathiravan.student_management_system.entity.Department;
import com.kathiravan.student_management_system.repository.DepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository) {

        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department addDepartment(
            Department department) {

        return departmentRepository.save(department);
    }

    public Department getDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department Not Found"));
    }
}