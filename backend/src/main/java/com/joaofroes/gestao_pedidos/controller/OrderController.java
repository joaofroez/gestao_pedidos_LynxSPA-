package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.OrderRequestDTO;
import com.joaofroes.gestao_pedidos.dto.OrderResponseDTO;
import com.joaofroes.gestao_pedidos.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


/**
 * Controlador REST responsável por expor os endpoints de gerenciamento de Pedidos.
 * <p>
 * Disponibiliza operações para listar, consultar detalhes, criar novos pedidos e atualizar status.
 * Mapeado para o caminho base <code>/orders</code>.
 * </p>
 * @author Joao Froes
 */
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

    /**
     * Lista todos os pedidos cadastrados no sistema de forma resumida.
     * <p>
     * Endpoint: <code>GET /orders</code>
     * </p>
     * @return Retorna status 200 (OK) com a lista de pedidos em formato DTO.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> findAll() {
        List<OrderResponseDTO> orders = service.findAll();
        return ResponseEntity.ok(orders);
    }

    /**
     * Busca os detalhes completos de um pedido específico pelo seu ID.
     * <p>
     * Endpoint: <code>GET /orders/{id}</code>
     * </p>
     * @param id O identificador único do pedido no banco de dados.
     * @return Retorna status 200 (OK) com os dados do pedido, ou 404 (Not Found) se não existir.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findById(@PathVariable Long id) {
        OrderResponseDTO orders = service.findById(id);
        return ResponseEntity.ok(orders);
    }

    /**
     * Cria um novo pedido no sistema.
     * <p>
     * Endpoint: <code>POST /orders</code>
     * O corpo da requisição deve conter o ID do cliente e a lista de itens.
     * </p>
     * @param dto Objeto com os dados de entrada validados (Cliente e itens).
     * @return Retorna status 201 (Created) e o corpo do pedido recém-criado (incluindo ID e totais calculados).
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> create(@RequestBody @Valid OrderRequestDTO dto) {
        OrderResponseDTO createdOrder = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    /**
     * Atualiza o status de um pedido existente (ex: Cancelamento).
     * <p>
     * Endpoint: <code>PATCH /orders/{id}</code>
     * </p>
     * @param id ID do pedido a ser atualizado.
     * @param body Um mapa JSON contendo a chave "status" e o novo valor (ex: {"status": "CANCELLED"}).
     * @return Retorna status 200 (OK) com o pedido atualizado.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String newStatus = body.get("status");
        OrderResponseDTO updatedOrder = service.updateStatus(id, newStatus);
        
        return ResponseEntity.ok(updatedOrder);
    }
}