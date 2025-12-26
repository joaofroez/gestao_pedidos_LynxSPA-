package com.joaofroes.gestao_pedidos.service;

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
    public List<ProductDTO> findAll() {
        return repository.findAll().stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }
}