package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.Order;
import com.joaofroes.gestao_pedidos.domain.entity.OrderStatus;
import com.joaofroes.gestao_pedidos.domain.entity.Payment;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    String customerName,
    String customerEmail,
    OrderStatus status,
    Integer totalCents,
    Long totalPaidCents,
    LocalDateTime createdAt,
    List<OrderItemResponseDTO> items,
    List<PaymentResponseDTO> payments
){
    public static OrderResponseDTO fromEntity(Order order) {
        List<PaymentResponseDTO> paymentsDto = List.of();
        
        long calculatedPaid = 0;
        if (order.getPayments() != null) {
            calculatedPaid = order.getPayments().stream()
                .mapToLong(Payment::getAmountCents)
                .sum();

            paymentsDto = order.getPayments().stream()
                .map(PaymentResponseDTO::fromEntity)
                .toList();
        }

        List<OrderItemResponseDTO> itemsDto = order.getItems().stream()
            .map(OrderItemResponseDTO::fromEntity)
            .toList();
            
        return new OrderResponseDTO(
            order.getId(),
            order.getCustomer().getName(),
            order.getCustomer().getEmail(),
            order.getStatus(),
            order.getTotalCents(),
            calculatedPaid,
            order.getCreatedAt(),
            itemsDto,
            paymentsDto
        );
    }
}