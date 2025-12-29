package com.joaofroes.gestao_pedidos.domain.entity;


/**
 * Define os possíveis estados do ciclo de vida de um Pedido ({@link Order}).
 * * @author Joao Froes
 */
public enum OrderStatus {
    /**
     * Estado inicial padrão de todo pedido.
     * Indica que o pedido foi registrado no sistema, mas ainda aguarda pagamentos
     * ou o valor pago ainda é insuficiente para cobrir o total.
     */
    NEW, 

    /**
     * Indica que o pedido foi totalmente quitado.
     * Este estado é alcançado automaticamente quando a soma dos pagamentos ({@link Payment})
     * se iguala ou supera o valor total do pedido.
     */
    PAID, 
    
    /**
     * Indica que o pedido foi cancelado e o processo foi interrompido.
     * Nenhuma nova operação de pagamento deve ser permitida neste estado.
     */
    CANCELLED
}
