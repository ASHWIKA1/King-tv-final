package com.kingstv.repository;

import com.kingstv.models.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long>, JpaSpecificationExecutor<Poll> {
}
