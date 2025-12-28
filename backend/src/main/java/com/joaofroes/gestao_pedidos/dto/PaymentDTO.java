package com.joaofroes.gestao_pedidos.dto;

import com.joaofroes.gestao_pedidos.domain.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentDTO(
    @NotNull(message = "O ID do pedido é obrigatório")
    Long orderId,

    @NotNull(message = "O método de pagamento é obrigatório (PIX, CARD, BOLETO)")
    PaymentMethod method,

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser positivo")
    Integer amountCents
){}