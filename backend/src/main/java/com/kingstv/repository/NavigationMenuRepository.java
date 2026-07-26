package com.kingstv.repository;

import com.kingstv.models.NavigationMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NavigationMenuRepository extends JpaRepository<NavigationMenu, Long> {
    List<NavigationMenu> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
    List<NavigationMenu> findByParentIdAndIsActiveOrderByDisplayOrderAsc(Long parentId, Boolean isActive);
    List<NavigationMenu> findByOrderByDisplayOrderAsc();
}
