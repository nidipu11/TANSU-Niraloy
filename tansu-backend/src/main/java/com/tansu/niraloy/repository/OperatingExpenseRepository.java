package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.OperatingExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OperatingExpenseRepository extends JpaRepository<OperatingExpense, Long> {
    List<OperatingExpense> findAllByOrderByCreatedAtDesc();
}
