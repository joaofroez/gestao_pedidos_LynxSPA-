package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.ProductDTO;
import com.joaofroes.gestao_pedidos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * Controlador REST responsável pela gestão do catálogo de produtos.
 * <p>
 * Fornece endpoints para consulta e filtragem de itens disponíveis para venda.
 * Mapeado para o caminho base <code>/products</code>.
 * </p>
 * @author Joao Froes
 */
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    /**
     * Pesquisa produtos no catálogo com suporte a filtros dinâmicos e opcionais.
     * <p>
     * Endpoint: <code>GET /products</code>
     * </p>
     * <p>
     * <b>Flexibilidade:</b> Se nenhum parâmetro for informado, retorna todos os produtos ativos.
     * Os filtros podem ser combinados (ex: buscar "Mouse" na categoria "Periféricos").
     * </p>
     *
     * @param name (Opcional) Trecho do nome do produto para busca parcial.
     * @param category (Opcional) Nome exato da categoria para filtragem.
     * @param active (Opcional) Estado do produto. Se {@code true}, retorna apenas os visíveis na loja.
     * Se não informado, pode retornar todos (útil para visão administrativa).
     * @return Retorna status 200 (OK) e a lista de produtos que correspondem aos critérios.
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean active
    ){
        List<ProductDTO> products = service.findAll(name, category, active);
        return ResponseEntity.ok(products);
    }
}