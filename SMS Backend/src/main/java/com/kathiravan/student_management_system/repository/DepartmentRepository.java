package com.kathiravan.student_management_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.kathiravan.student_management_system.entity.Department;


public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Optional<Department> findByNameIgnoreCase(String name);

}