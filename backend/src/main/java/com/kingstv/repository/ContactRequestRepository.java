package com.kingstv.repository;

import com.kingstv.models.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long>, JpaSpecificationExecutor<ContactRequest> {
}
