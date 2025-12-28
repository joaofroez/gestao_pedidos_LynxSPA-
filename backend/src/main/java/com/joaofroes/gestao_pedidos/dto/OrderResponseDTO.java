package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.Order;
import com.joaofroes.gestao_pedidos.domain.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    String customerName,
    String customerEmail,
    OrderStatus status,
    Integer totalCents,
    LocalDateTime createdAt,
    List<OrderItemResponseDTO> items
){
    public static OrderResponseDTO fromEntity(Order order) {
        List<OrderItemResponseDTO> itemsDto = order.getItems().stream()
            .map(OrderItemResponseDTO::fromEntity)
            .toList();
            
        return new OrderResponseDTO(
            order.getId(),
            order.getCustomer().getName(),
            order.getCustomer().getEmail(),
            order.getStatus(),
            order.getTotalCents(),
            order.getCreatedAt(),
            itemsDto
        );
    }
}