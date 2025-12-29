# Gestão de Pedidos - Desafio Técnico (Estágio)

Seja bem-vindo(a) ao repositório da minha solução para a avaliação técnica de estágio da **Lynx SPA**.

Este projeto consiste em uma aplicação Fullstack para o gerenciamento de pedidos, produtos e pagamentos, focando em simplicidade, organização e código limpo.

---

## Sobre o Projeto

O objetivo deste desafio foi desenvolver uma mini aplicação capaz de controlar o fluxo completo de uma compra:
1.  **Home:** Listagem de produtos com filtros (Nome, Categoria, Ativos).
2.  **Carrinho:** Gestão de itens no LocalStorage do navegador.
3.  **Checkout:** Criação de pedidos enviando dados para o servidor.
4.  **Pagamentos:** Múltiplas formas de pagamento (PIX, Cartão, Boleto) com baixa automática de pedidos.

---

## Tecnologias Utilizadas

### Backend (API REST)
* **Java** com **Spring Boot**: Robustez e agilidade.
* **Maven**: Gerenciamento de dependências e build.
* **Database / SQLite**: Banco de dados relacional.
* **Javadoc**: Documentação técnica das classes e métodos.

### Frontend (Cliente Web)
* **HTML5 e CSS3**: Interface limpa e responsiva.
* **JavaScript**: Código modularizado (`main.js`, `cart.js`, etc.) sem uso de frameworks, focando nos fundamentos da linguagem.

---

## 📂 Organização do Projeto

A estrutura foi pensada para separar responsabilidades de forma clara:

```text
/
├── backend/                  # Código Fonte Java (Spring Boot)
│   ├── src/main/java/com...  # Config, Controllers, Services, DTOs, Entities, Repository e Exception
│   
├── frontend/                 # Interface Web
│   ├── css/                  # Estilos separados por contexto (orders, cart, products)
│   ├── js/                   # Módulos JavaScript
│   │   ├── api.js            # Configuração centralizada da URL
│   │   ├── main.js           # Ponto de entrada (Entry point)
│   │   └── ...js             # Lógica de cada página (cart.js, products.js, orders.js, utils.js,)
│   └── html/                 # Páginas da aplicação (home.html, cart.html, order.html)
```
## Guia de Execução

Siga as instruções abaixo para rodar a aplicação completa em seu ambiente local.

### Pré-requisitos
* **Java JDK 17** ou superior instalado
* **Maven** (Opcional, pois o projeto inclui o wrapper `mvnw`)
* **Navegador Web** moderno (Chrome, Edge, Firefox)

---

### 1️- Rodando o Backend (API)

O backend é responsável por toda a lógica de negócio e conexão com o banco de dados.

1.  Crie uma pasta e clone o repositório nela com o comando: 
    ```bash
    git clone https://github.com/joaofroez/gestao_pedidos_LynxSPA-.git
    ```
2.  Abra o terminal na pasta backend:
    ```bash
    cd backend
    ```
3.  Execute o comando para subir o servidor:

    ```powershell
    mvnw spring-boot:run
    ```
4.  Aguarde até aparecer a mensagem de log indicando que o servidor iniciou (geralmente na porta `8080`).
    * *Teste rápido:* Acesse `http://localhost:8080/products` no navegador. Se aparecer um JSON, o backend está funcionando.

---

### 2️- Rodando o Frontend

⚠️ **Atenção:** Como este projeto utiliza **Módulos ES6** para organização do código, **não é possível abrir o arquivo `home.html` diretamente** pelo explorador de arquivos. É necessário utilizar um servidor local simples.

#### Solução: Usando VS Code (Recomendado)
1.  Abra a pasta do frontend no **VS Code**.
2.  Instale a extensão **"Live Server"** (se ainda não tiver).
3.  Clique com o botão direito no arquivo `home.html`.
4.  Selecione a opção **"Open with Live Server"**.
5.  O navegador abrirá automaticamente o site.

---

### 3️-Testando a Integração
Com o Backend rodando na porta `8080` e o Frontend aberto no navegador:

1.  Acesse a página inicial da loja.
2.  Se a lista de produtos carregar automaticamente, significa que a conexão entre Frontend e Backend foi estabelecida com sucesso.
3.  Agora você pode adicionar itens ao carrinho e simular uma compra.

## Melhorias Futuras

Este projeto foi desenvolvido para ser viável ao mínimo para atender aos requisitos da avaliação. Visando uma evolução para um ambiente de produção real, as seguintes features foram mapeadas:

* Implementar sistema de Login e Cadastro (Spring Security + JWT) para diferenciar perfis de Clientes e Administradores.
* Migrar os filtros de categorias do *frontend* (hardcoded) para uma tabela dedicada no banco de dados, permitindo gestão dinâmica.
* Aprimorar a regra de negócio para bloquear tentativas de pagamento com valor superior ao saldo restante do pedido.
* Adição de coluna `base_price` (preço de tabela) para permitir lógica de descontos e exibir ofertas ("De: X, Por: Y") no preço atual.
* Criação de uma tabela de logs para rastreabilidade de erros e operações críticas (quem alterou o status, falhas de transação, etc.).