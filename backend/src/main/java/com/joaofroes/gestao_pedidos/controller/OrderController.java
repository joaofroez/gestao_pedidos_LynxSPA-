package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.OrderRequestDTO;
import com.joaofroes.gestao_pedidos.dto.OrderResponseDTO;
import com.joaofroes.gestao_pedidos.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // GET - lista pedidos resumidos
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> findAll() {
        List<OrderResponseDTO> orders = service.findAll();
        return ResponseEntity.ok(orders);
    }

    // GET /orders/{id} - detalhes do pedido
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findById(@PathVariable Long id) {
        OrderResponseDTO orders = service.findById(id);
        return ResponseEntity.ok(orders);
    }

    // POST - cria pedido
    @PostMapping
    public ResponseEntity<OrderResponseDTO> create(@RequestBody @Valid OrderRequestDTO dto) {
        OrderResponseDTO createdOrder = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // PATCH /orders/{id} - Atualiza o status
    @PatchMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String newStatus = body.get("status");
        OrderResponseDTO updatedOrder = service.updateStatus(id, newStatus);
        
        return ResponseEntity.ok(updatedOrder);
    }
}