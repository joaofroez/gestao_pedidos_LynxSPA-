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
        const statusTranslated = translateStatus(order.status);
        
        const totalFmt = (order.totalCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

        const statusClass = order.status ? order.status.toLowerCase() : 'new';

        list.innerHTML += `
            <div class="order-card status-${statusClass}">
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
    
    modalBody.innerHTML = "<p>Carregando...</p>";
    modal.classList.remove("hidden");

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if(!response.ok) throw new Error("Erro ao carregar detalhes");
        const order = await response.json();

        // 1. DADOS FINANCEIROS (Vindos da API)
        const totalCents = order.totalCents;
        // Usa o valor calculado pelo Java. Se vier nulo, assume 0.
        const paidCents = order.totalPaidCents || 0; 
        const remainingCents = totalCents - paidCents;

        const totalFmt = (totalCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        const paidFmt = (paidCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        const remainingFmt = (remainingCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        const remainingFloat = remainingCents / 100;

        // 2. MONTAR HISTÓRICO DE PAGAMENTOS
        let historyRows = "";
        if (order.payments && order.payments.length > 0) {
            order.payments.forEach(pay => {
                // Ajuste o campo de data conforme seu DTO de pagamento (paidAt ou createdAt)
                const pDate = pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('pt-BR') : '-';
                const pVal = (pay.amountCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
                
                historyRows += `
                    <tr>
                        <td>${pDate}</td>
                        <td>${pay.method}</td>
                        <td style="color:#27ae60; font-weight:bold">${pVal}</td>
                    </tr>
                `;
            });
        } else {
            historyRows = `<tr><td colspan="3" style="text-align:center; color:#999">Nenhum pagamento registrado.</td></tr>`;
        }

        // 3. TABELA DE PRODUTOS
        let itemsHtml = "";
        if(order.items) {
            itemsHtml = order.items.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td>${(item.unitPriceCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                    <td align="center">${item.quantity}</td>
                    <td align="right">${(item.totalCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>
            `).join('');
        }

        // 4. LÓGICA DE EXIBIÇÃO DE CONTROLES
        let controlsHtml = "";

        // CENÁRIO A: PEDIDO CANCELADO
        if (order.status === "CANCELLED") {
            controlsHtml = `
                <div style="margin-top:20px; padding:15px; background:#fdedec; border:1px solid #c0392b; color:#c0392b; text-align:center; border-radius:5px;">
                    🚫 <strong>PEDIDO CANCELADO</strong>
                    ${paidCents > 0 ? `<br><small>Houve pagamentos de ${paidFmt}. Status: Estorno Pendente.</small>` : ''}
                </div>
            `;
        } 
        // CENÁRIO B: PEDIDO JÁ PAGO (TOTALMENTE)
        else if (remainingCents <= 0 || order.status === "PAID") {
            controlsHtml = `
                <div style="margin-top:20px; padding:15px; background:#e8f8f5; border:1px solid #27ae60; color:#27ae60; text-align:center; border-radius:5px;">
                    ✅ <strong>PEDIDO QUITADO</strong><br>
                    Total pago: ${paidFmt}
                </div>
            `;
        } 
        // CENÁRIO C: PAGAMENTO PENDENTE (Permite pagar e cancelar)
        else {
            let refundMsg = "";
            if (paidCents > 0) {
                refundMsg = `<div class="warning-box">⚠️ Ao cancelar, o valor já pago de <strong>${paidFmt}</strong> entrará em processo de estorno.</div>`;
            }

            controlsHtml = `
                <div class="payment-section">
                    <p style="font-weight:bold; margin-bottom:10px; color:#e67e22">Realizar Pagamento:</p>
                    
                    <div class="pay-controls">
                        <div class="input-money-group">
                            <label style="font-size:0.8rem">Valor (R$):</label>
                            <input type="number" id="payAmountInput" class="money-input" 
                                value="${remainingFloat.toFixed(2)}" step="0.01" max="${remainingFloat.toFixed(2)}">
                        </div>
                        <div class="input-money-group">
                            <label style="font-size:0.8rem">Método:</label>
                            <select id="payMethodInput" class="money-input">
                                <option value="PIX">💠 PIX</option>
                                <option value="CREDIT_CARD">💳 Crédito</option>
                                <option value="DEBIT_CARD">💳 Débito</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button onclick="makePayment(${order.id})" class="btn-pay">Pagar</button>
                        <button onclick="cancelOrder(${order.id}, ${paidCents})" class="btn-cancel">Cancelar Pedido</button>
                    </div>
                    ${refundMsg}
                </div>
            `;
        }

        // 5. RENDERIZAÇÃO FINAL
        modalBody.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Pedido #${order.id}</h2>
                <span class="status-badge status-${order.status.toLowerCase()}">${translateStatus(order.status)}</span>
            </div>
            <p><strong>Cliente:</strong> ${order.customerName}</p>

            <div class="payment-history-container">
                <details ${paidCents > 0 ? 'open' : ''}>
                    <summary class="payment-history-summary">
                        <span>Histórico de Pagamentos</span>
                        <span style="font-size:0.8rem; color:#27ae60">Total Pago: ${paidFmt}</span>
                    </summary>
                    <table class="history-table">
                        <thead><tr><th>Data</th><th>Método</th><th>Valor</th></tr></thead>
                        <tbody>${historyRows}</tbody>
                    </table>
                </details>
            </div>

            <table class="modal-table" style="width:100%; text-align:left; margin-top:15px">
                <thead style="background:#f9f9f9"><tr><th>Produto</th><th>Preço</th><th>Qtd</th><th align="right">Subtotal</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            
            <div style="display:flex; justify-content:space-between; margin-top:15px; font-weight:bold; font-size:1.1rem">
                <span>Restante: <span style="color:#c0392b">${remainingFmt}</span></span>
                <span>Total Pedido: ${totalFmt}</span>
            </div>
            
            ${controlsHtml}
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