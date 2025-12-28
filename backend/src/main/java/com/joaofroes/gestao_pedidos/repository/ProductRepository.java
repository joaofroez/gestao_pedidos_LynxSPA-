package com.joaofroes.gestao_pedidos.repository;

import com.joaofroes.gestao_pedidos.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActive(Boolean active);
    List<Product> findByCategoryAndActive(String category, Boolean active);
    List<Product> findByNameContainingIgnoreCaseAndActive(String name, Boolean active);
}