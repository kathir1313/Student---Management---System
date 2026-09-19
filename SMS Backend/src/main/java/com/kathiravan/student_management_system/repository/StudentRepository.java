package com.kathiravan.student_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.kathiravan.student_management_system.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

  List<Student> findByNameContainingIgnoreCase(String name);

List<Student> findByDepartment_NameIgnoreCase(String departmentName);
}