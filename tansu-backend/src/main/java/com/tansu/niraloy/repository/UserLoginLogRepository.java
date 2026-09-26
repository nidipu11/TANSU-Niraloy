package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.UserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserLoginLogRepository extends JpaRepository<UserLoginLog, Long> {
    List<UserLoginLog> findByEmailOrderByLoginTimeDesc(String email);
    List<UserLoginLog> findAllByOrderByLoginTimeDesc();
}
