package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.PaymentRequestDTO;
import com.joaofroes.gestao_pedidos.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST responsável pelo processamento de pagamentos.
 * <p>
 * Gerencia a entrada de transações financeiras e serve como ponto de entrada
 * para a lógica de quitação de pedidos.
 * Mapeado para o caminho base <code>/payments</code>.
 * </p>
 * @author Joao Froes
 */
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
    
    /**
     * Registra um novo pagamento para um pedido específico.
     * <p>
     * Endpoint: <code>POST /payments</code>
     * </p>
     * <p>
     * <b>Fluxo de Negócio:</b> Ao receber um pagamento válido, o sistema automaticamente
     * recalcula o saldo do pedido. Se o total pago cobrir o valor do pedido,
     * o status do pedido será atualizado para {@code PAID}.
     * </p>
     * @param dto Objeto contendo o ID do pedido, o valor em centavos e o método de pagamento.
     * @return Retorna status 201 (Created) e os dados do pagamento confirmado.
     */
    @PostMapping
    public ResponseEntity<PaymentRequestDTO> create(@RequestBody @Valid PaymentRequestDTO dto) {
        PaymentRequestDTO createdPayment = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }
}