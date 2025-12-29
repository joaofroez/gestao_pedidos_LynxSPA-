package com.joaofroes.gestao_pedidos.domain.entity;
import jakarta.persistence.*;

/**
 * Representa um item individual dentro de um pedido (Order Item).
 * <p>
 * Esta entidade serve como uma tabela de ligação entre {@link Order} e {@link Product},
 * mas com atributos adicionais (quantidade e preço histórico).
 * </p>
 * * @author Joao Froes
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    /**
     * Identificador único do item do pedido.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * O pedido ao qual este item pertence.
     * É a parte "Many" do relacionamento OneToMany em Order.
     * Muitos itens podem pertencer a um único pedido.
     */
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * O produto que está sendo pedido.
     * Relacionamento ManyToOne, pois muitos itens podem referenciar o mesmo produto.
     */
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * A quantidade de unidades compradas deste produto específico.
     */
    @Column(nullable = false)
    private Integer quantity;

    /**
     * Preço unitário do produto <b>no momento da compra</b> (em centavos).
     * <p>
     * <strong>Regra de Negócio:</strong> Este valor é gravado no momento da criação do pedido
     * e serve como histórico. Ele NÃO deve ser atualizado se o preço do {@link Product} mudar
     * no futuro.
     * </p>
     */
    @Column(name = "unit_price_cents", nullable = false)
    private Integer unitPriceCents;

    public OrderItem() {

    } 
    
    /**
     * Construtor completo para facilitar a criação de novos itens.
     * * @param order O pedido pai.
     * @param product O produto selecionado.
     * @param quantity Quantidade desejada.
     * @param unitPriceCents O preço do produto congelado neste momento.
     */
    public OrderItem(Order order, Product product, Integer quantity, Integer unitPriceCents) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPriceCents = unitPriceCents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getUnitPriceCents() {
        return unitPriceCents;
    }

    public void setUnitPriceCents(Integer unitPriceCents) {
        this.unitPriceCents = unitPriceCents;
    }  
}
