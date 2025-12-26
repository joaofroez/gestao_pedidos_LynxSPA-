package com.joaofroes.gestao_pedidos.service;

import com.joaofroes.gestao_pedidos.domain.entity.Product;
import com.joaofroes.gestao_pedidos.dto.ProductDTO;
import com.joaofroes.gestao_pedidos.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> findAll(String name, String category, Boolean active) {
        List<Product> products;
        
        if (name != null && !name.isBlank()) {
            Boolean statusFilter = (active != null) ? active : true;
            products = repository.findByNameContainingIgnoreCaseAndActive(name, statusFilter);
        
        } else if (category != null && !category.isBlank()) {
            Boolean statusFilter = (active != null) ? active : true;
            products = repository.findByCategoryAndActive(category, statusFilter);
        
        } else if (active != null) {
            products = repository.findByActive(active);
        
        //  em produção precisaria de paginação
        } else {
            products = repository.findAll();
        }

        return products.stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }
}