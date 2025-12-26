package com.joaofroes.gestao_pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequestDTO(
    @NotNull(message = "O ID do cliente é obrigatório")
    Long customerId,

    @NotEmpty(message = "O pedido deve ter pelo menos um item")
    @Valid
    List<OrderItemRequestDTO> items
){}