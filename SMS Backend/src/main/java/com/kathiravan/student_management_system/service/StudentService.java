package com.kathiravan.student_management_system.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.kathiravan.student_management_system.dto.StudentDTO;
import com.kathiravan.student_management_system.entity.Student;
import com.kathiravan.student_management_system.exception.DuplicateEmailException;
import com.kathiravan.student_management_system.exception.ResourceNotFoundException;
import com.kathiravan.student_management_system.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ================= DTO Conversion =================

    private StudentDTO convertToDTO(Student student) {

        StudentDTO dto = new StudentDTO();

        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());

        return dto;
    }

    private Student convertToEntity(StudentDTO dto) {

        Student student = new Student();

        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setDepartment(dto.getDepartment());

        return student;
    }

    // ================= CRUD =================

    public List<StudentDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public StudentDTO getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id " + id));

        return convertToDTO(student);
    }

    public StudentDTO addStudent(StudentDTO dto) {

        if (studentRepository.findByEmail(dto.getEmail()).isPresent()) {

            throw new DuplicateEmailException(
                    "Email already exists: " + dto.getEmail());
        }

        Student savedStudent = studentRepository.save(convertToEntity(dto));

        return convertToDTO(savedStudent);
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id " + id));

        Student emailCheck = studentRepository.findByEmail(dto.getEmail())
                .orElse(null);

        if (emailCheck != null &&
                !emailCheck.getId().equals(id)) {

            throw new DuplicateEmailException(
                    "Email already exists: " + dto.getEmail());
        }

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setDepartment(dto.getDepartment());

        Student updatedStudent = studentRepository.save(student);

        return convertToDTO(updatedStudent);
    }

    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id " + id));

        studentRepository.delete(student);
    }

    // ================= PATCH =================

    public StudentDTO partialUpdateStudent(
            Long id,
            StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id " + id));

        if (dto.getName() != null) {
            student.setName(dto.getName());
        }

        if (dto.getEmail() != null) {

            Student emailCheck = studentRepository.findByEmail(dto.getEmail())
                    .orElse(null);

            if (emailCheck != null &&
                    !emailCheck.getId().equals(id)) {

                throw new DuplicateEmailException(
                        "Email already exists: "
                                + dto.getEmail());
            }

            student.setEmail(dto.getEmail());
        }

        if (dto.getDepartment() != null) {
            student.setDepartment(dto.getDepartment());
        }

        Student updatedStudent = studentRepository.save(student);

        return convertToDTO(updatedStudent);
    }

    // ================= Count =================

    public long countStudents() {
        return studentRepository.count();
    }

    // ================= Search =================

    public StudentDTO getStudentByEmail(String email) {

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with email " + email));

        return convertToDTO(student);
    }

    public List<StudentDTO> getStudentsByDepartment(
            String departmentName) {

        return studentRepository
                .findByDepartment_NameIgnoreCase(departmentName)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<StudentDTO> getStudentsByName(
            String name) {

        return studentRepository
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<StudentDTO> filterByDepartment(
            String departmentName) {

        return studentRepository
                .findByDepartment_NameIgnoreCase(departmentName)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // ================= Pagination + Sorting =================

    public Page<StudentDTO> getStudentsWithPagination(
            int page,
            int size,
            String sortBy) {

        Page<Student> students = studentRepository.findAll(
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy)));

        return students.map(this::convertToDTO);
    }

    // ================= Dynamic Sorting =================

    public List<StudentDTO> getStudentsSorted(
            String field,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(field).descending()
                : Sort.by(field).ascending();

        return studentRepository.findAll(sort)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<StudentDTO> searchStudents(String keyword) {

        return studentRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
}