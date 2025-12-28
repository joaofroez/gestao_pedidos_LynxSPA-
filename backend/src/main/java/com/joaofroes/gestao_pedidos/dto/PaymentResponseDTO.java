package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.Payment;
import com.joaofroes.gestao_pedidos.domain.entity.PaymentMethod;
import java.time.LocalDateTime;

public record PaymentResponseDTO(
    Long id,
    Long orderId,
    PaymentMethod method,
    Integer amountCents,
    LocalDateTime paidAt
) {
    public static PaymentResponseDTO fromEntity(Payment payment) {
        return new PaymentResponseDTO(
            payment.getId(),
            payment.getOrder().getId(),
            payment.getMethod(),
            payment.getAmountCents(),
            payment.getPaidAt()
        );
    }
}