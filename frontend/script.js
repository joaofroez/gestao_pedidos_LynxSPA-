const API_URL = "http://localhost:8080";

let state = {
    cart: JSON.parse(localStorage.getItem('myCart')) || []
};

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    const searchInput = document.getElementById("searchName");
    if (searchInput) {
        loadProducts();

        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") loadProducts();
        });
    }

    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        renderCartPage(); 
    }

    if (document.getElementById("orders-list")) {
        loadMyOrders();
    }
});

async function loadProducts() {
    const name = document.getElementById("searchName").value;
    const category = document.getElementById("searchCategory") ? document.getElementById("searchCategory").value : "";
    const activeEl = document.getElementById("searchActive");
    const active = activeEl ? activeEl.checked : true;

    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (category) params.append("category", category);
    params.append("active", active);

    try {
        const response = await fetch(`${API_URL}/products?${params}`);
        if (!response.ok) throw new Error("Erro na resposta da API");
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("❌ Erro:", error);
        const list = document.getElementById("products-list");
        if(list) {
            list.innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar na API: ${error.message}</p>`;
        }
    }
}

function renderProducts(products) {
    const list = document.getElementById("products-list");
    if(!list) return;

    list.innerHTML = ""; 

    if (products.length === 0) {
        list.innerHTML = `<p>Nenhum produto encontrado.</p>`;
        return;
    }

    products.forEach(p => {
        const priceFormatted = (p.priceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Imagens de placeholder
        let imageUrl = "https://placehold.co/200x150?text=Produto";
        if(p.category && p.category.toLowerCase().includes("eletronico")) imageUrl = "https://placehold.co/200x150/2563eb/FFF?text=Tech";
        if(p.category && p.category.toLowerCase().includes("acessorio")) imageUrl = "https://placehold.co/200x150/orange/FFF?text=Acessorio";
        
        const btnDisabled = p.active ? "" : "disabled";
        const btnText = p.active ? "🛒 Adicionar" : "Indisponível";

        list.innerHTML += `
            <div class="product-card ${!p.active ? 'inactive' : ''}">
                <div class="card-image-wrapper">
                    <span class="category-badge">${p.category || 'Geral'}</span>
                    <img src="${imageUrl}" alt="${p.name}">
                </div>
                <div class="card-content">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">${priceFormatted}</div>
                    <button class="btn-add-cart" 
                        onclick="addToCart(${p.id}, '${p.name}', ${p.priceCents})" 
                        ${btnDisabled}>
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
    });
}

function addToCart(id, name, priceCents) {
    const existingItem = state.cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            id: id,
            name: name,
            price: priceCents,
            quantity: 1
        });
    }

    saveCart();
    showToast(`"${name}" adicionado!`);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage(); 
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(state.cart));
    updateCartCount();
}

function updateCartCount() {
    const badge = document.getElementById("cart-count-badge");
    if(badge) {
        const totalQty = state.cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.innerText = totalQty;
    }
}

function renderCartPage() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total-value");
    if(!container) return;

    container.innerHTML = "";
    if (state.cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        totalEl.innerText = "R$ 0,00";
        return;
    }

    let totalCents = 0;

    state.cart.forEach(item => {
        totalCents += item.price * item.quantity;
        const priceUnit = (item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const subtotal = ((item.price * item.quantity) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <small>Unit: ${priceUnit}</small>
                </div>
                
                <div class="cart-qty-controls">
                    <button class="qty-btn-mini" onclick="changeCartItemQty(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn-mini" onclick="changeCartItemQty(${item.id}, 1)">+</button>
                </div>

                <div class="cart-item-price">
                    <strong>${subtotal}</strong>
                </div>

                <button onclick="removeFromCart(${item.id})" class="btn-remove-icon" title="Remover">🗑️</button>
            </div>
        `;
    });

    totalEl.innerText = (totalCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function changeCartItemQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity < 1) item.quantity = 1;

    saveCart();
    renderCartPage();
}

async function checkout() {
    if (state.cart.length === 0) return alert("Carrinho vazio!");
    // hardcodeed para teste
    const orderData = {
        customerId: 1, 
        items: state.cart.map(i => ({ productId: i.id, quantity: i.quantity }))
    };

    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            alert("Pedido realizado com sucesso!");
            state.cart = [];
            saveCart();
            window.location.href = "home.html";
        } else {
            alert("Erro ao finalizar pedido.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `<span>✅</span> <span>${msg}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function loadMyOrders() {
    const list = document.getElementById("orders-list");
    list.innerHTML = "<p>Carregando pedidos...</p>";
    
    try {
        console.log("🔄 Buscando pedidos em:", `${API_URL}/orders`);
        
        const response = await fetch(`${API_URL}/orders`); 
        
        if (!response.ok) {
            throw new Error(`Erro API: ${response.status}`);
        }
        
        const allOrders = await response.json();

        console.log("📦 DADOS RECEBIDOS DO BACKEND:", allOrders);
        
        if (allOrders.length > 0) {
            console.log("🔎 Exemplo do primeiro pedido:", allOrders[0]);
            // Verifica como o cliente vem no JSON
            if(allOrders[0].client) console.log("Tem objeto client.");
            if(allOrders[0].customerId) console.log("Tem campo customerId.");
        }
        const myOrders = allOrders; 

        renderOrdersList(myOrders);

    } catch (error) {
        console.error("❌ ERRO CRÍTICO:", error);
        list.innerHTML = `<p style="color:red; padding:20px; text-align:center">
            Erro ao conectar: ${error.message}<br>
            <small>Abra o Console (F12) para ver detalhes.</small>
        </p>`;
    }
}

function renderOrdersList(orders) {
    const list = document.getElementById("orders-list");
    list.innerHTML = "";

    if (!orders || orders.length === 0) {
        list.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
        return;
    }

    orders.reverse(); 

    orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
        
        const totalFmt = (order.totalCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        
        const statusTranslated = translateStatus(order.status);

        list.innerHTML += `
            <div class="order-card status-${order.status ? order.status.toLowerCase() : 'new'}">
                <div class="order-info">
                    <h3>Pedido #${order.id}</h3>
                    <span class="order-date">Data: ${date}</span> <br>
                    <strong>Status: ${statusTranslated}</strong>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:bold; margin-bottom:5px; font-size:1.2rem">${totalFmt}</div>
                    <button class="btn-details" onclick="openOrderDetails(${order.id})">Ver Detalhes</button>
                </div>
            </div>
        `;
    });
}

async function openOrderDetails(orderId) {
    const modalBody = document.getElementById("modal-body");
    const modal = document.getElementById("order-modal");
    
    modalBody.innerHTML = "<p>Carregando detalhes...</p>";
    modal.classList.remove("hidden");

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if(!response.ok) throw new Error("Erro ao carregar detalhes");
        
        const order = await response.json();
        
        let itemsHtml = "";
        if(order.items) {
            order.items.forEach(item => {
                const priceFmt = (item.unitPriceCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
                const subtotalFmt = (item.totalCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
                itemsHtml += `
                    <tr>
                        <td>${item.productName}</td>
                        <td>${priceFmt}</td>
                        <td style="text-align:center">${item.quantity}</td>
                        <td style="text-align:right">${subtotalFmt}</td>
                    </tr>
                `;
            });
        }

        const totalOrderFmt = (order.totalCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        
        let actionsHtml = "";
        
        if (order.status === "NEW") {
            actionsHtml = `
                <div class="payment-section">
                    <p style="margin-bottom:10px; font-weight:bold; color:#e67e22">
                        Pedido pendente. Escolha como pagar:
                    </p>
                    
                    <div style="margin-bottom: 15px;">
                        <select id="paymentMethod" class="payment-select">
                            <option value="CREDIT_CARD">💳 Cartão de Crédito</option>
                            <option value="PIX">💠 PIX</option>
                            <option value="BOLETO">📄 Boleto</option>
                        </select>
                    </div>

                    <div class="modal-actions">
                        <button onclick="simulatePayment(${order.id}, ${order.totalCents})" class="btn-pay">
                            Confirmar Pagamento
                        </button>
                        
                        <button onclick="cancelOrder(${order.id})" class="btn-cancel">
                            Cancelar Pedido
                        </button>
                    </div>
                </div>
            `;
        } else if (order.status === "PAID") {
            actionsHtml = `
                <div style="margin-top:20px; text-align:center; padding:15px; background:#e8f8f5; border:1px solid #27ae60; border-radius:8px; color:#27ae60;">
                    ✅ <strong>Pagamento Confirmado!</strong><br>
                    Seu pedido já foi processado.
                </div>
            `;
        } else if (order.status === "CANCELLED") {
            actionsHtml = `
                <div style="margin-top:20px; text-align:center; padding:15px; background:#fdedec; border:1px solid #c0392b; border-radius:8px; color:#c0392b;">
                    🚫 <strong>Pedido Cancelado.</strong><br>
                    Não é possível realizar ações neste pedido.
                </div>
            `;
        }

        modalBody.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Pedido #${order.id}</h2>
                <span class="status-badge status-${order.status.toLowerCase()}">${translateStatus(order.status)}</span>
            </div>
            
            <p><strong>Cliente:</strong> ${order.customerName}</p>
            <p style="font-size:0.9rem; color:#666">Criado em: ${new Date(order.createdAt).toLocaleString('pt-BR')}</p>
            
            <table class="modal-table" style="width:100%; text-align:left; margin-top:15px">
                <thead style="background:#f9f9f9">
                    <tr><th>Produto</th><th>Preço</th><th>Qtd</th><th style="text-align:right">Subtotal</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            
            <div class="modal-total" style="text-align:right; margin-top:15px; font-size:1.3rem; font-weight:bold">
                Total: ${totalOrderFmt}
            </div>
            
            ${actionsHtml}
        `;

    } catch (e) {
        console.error(e);
        modalBody.innerHTML = `<p style="color:red">Erro: ${e.message}</p>`;
    }
}

async function cancelOrder(orderId) {
    if(!confirm("Tem certeza que deseja cancelar? Essa ação é irreversível.")) return;

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'CANCELLED' }) 
        });

        if (response.ok) {
            alert("Pedido cancelado com sucesso!");
            closeModal();
            loadMyOrders();
        } else {
            console.error("Erro no cancelamento");
            alert("Não foi possível cancelar. Verifique se o pedido já não foi pago.");
        }
    } catch (error) {
        alert("Erro de conexão: " + error.message);
    }
}

function closeModal() {
    document.getElementById("order-modal").classList.add("hidden");
}

function translateStatus(status) {
    const map = {
        'NEW': 'Aguardando Pagamento',
        'PAID': 'Pago',
        'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
}