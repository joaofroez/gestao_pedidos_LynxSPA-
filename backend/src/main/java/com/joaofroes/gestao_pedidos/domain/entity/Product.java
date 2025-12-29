package com.joaofroes.gestao_pedidos.domain.entity;
import jakarta.persistence.*;


/**
 * Representa um item (Produto) disponível no catálogo da loja.
 * <p>
 * Mapeada para a tabela "products", esta entidade contém os dados descritivos
 * e o valor atual de venda.
 * </p>
 * @author Joao Froes
 */
@Entity
@Table(name = "products")
public class Product {

    /**
     * Identificador único do produto no sistema.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome comercial do produto.
     * Campo obrigatório.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Categoria para agrupamento e filtragem.
     * Utilizada nas buscas do frontend.
     */
    @Column(nullable = false)
    private String category;

    /**
     * Preço atual de venda em centavos.
     * <p>
     * <b>Decisão de Arquitetura:</b> Valores monetários são armazenados como inteiros
     * para garantir precisão absoluta e evitar erros de ponto flutuante
     * comuns em cálculos financeiros. Ex: R$ 19,90 = 1990.
     * </p>
     */
    @Column(name = "price_cents", nullable = false)
    private Integer priceCents;

    /**
     * Define a visibilidade do produto no catálogo (Soft Delete).
     * <ul>
     * <li><b>true:</b> Produto aparece nas buscas e pode ser comprado.</li>
     * <li><b>false:</b> Produto indisponível, mas aparece nas buscas</li>
     * </ul>
     * <p>
     * <b>Regra de Negócio:</b> Produtos não devem ser excluídos fisicamente do banco de dados
     * caso já tenham sido vendidos em pedidos anteriores, para manter a integridade
     * do histórico ({@link OrderItem}).
     * </p>
     */
    @Column(nullable = false)
    private Boolean active = true; 

    public Product() {
        
    }

    /**
     * Construtor de conveniência para cadastro de novos produtos.
     * Por padrão, o produto nasce ativo.
     * * @param name Nome do produto.
     * @param category Categoria do produto.
     * @param priceCents Preço em centavos.
     */
    public Product(String name, String category, Integer priceCents) {
        this.name = name;
        this.category = category;
        this.priceCents = priceCents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getPriceCents() {
        return priceCents;
    }

    public void setPriceCents(Integer priceCents) {
        this.priceCents = priceCents;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
