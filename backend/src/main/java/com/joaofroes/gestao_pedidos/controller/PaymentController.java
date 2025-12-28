package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.PaymentDTO;
import com.joaofroes.gestao_pedidos.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }
    // POST - cria pagamento
    @PostMapping
    public ResponseEntity<PaymentDTO> create(@RequestBody @Valid PaymentDTO dto) {
        PaymentDTO createdPayment = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }
}