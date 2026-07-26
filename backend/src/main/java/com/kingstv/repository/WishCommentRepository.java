package com.kingstv.repository;

import com.kingstv.models.WishComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WishCommentRepository extends JpaRepository<WishComment, Long> {
    List<WishComment> findByWishIdAndParentIsNullOrderByCreatedAtDesc(Long wishId);
    List<WishComment> findByParentIdOrderByCreatedAtAsc(Long parentId);
}
