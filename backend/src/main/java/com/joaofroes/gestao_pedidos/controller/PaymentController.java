package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.PaymentRequestDTO;
import com.joaofroes.gestao_pedidos.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }
    // POST - cria pagamento
    @PostMapping
    public ResponseEntity<PaymentRequestDTO> create(@RequestBody @Valid PaymentRequestDTO dto) {
        PaymentRequestDTO createdPayment = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }
}