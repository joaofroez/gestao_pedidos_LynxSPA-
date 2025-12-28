package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.OrderItem;

public record OrderItemResponseDTO(
    Long id,
    String productName,
    Integer quantity,
    Integer unitPriceCents,
    Integer totalCents
){
    public static OrderItemResponseDTO fromEntity(OrderItem item) {
        return new OrderItemResponseDTO(
            item.getId(),
            item.getProduct().getName(),
            item.getQuantity(),
            item.getUnitPriceCents(),
            item.getQuantity() * item.getUnitPriceCents()
        );
    }
}