package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.Product;

public record ProductDTO(
    Long id,
    String name,
    String category,
    Integer priceCents,
    Boolean active
){
    public static ProductDTO fromEntity(Product product) {
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getCategory(),
            product.getPriceCents(),
            product.getActive()
        );
    }
}