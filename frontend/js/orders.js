import { API_URL } from './api.js';
import { formatCurrency, translateStatus } from './utils.js';

export async function loadMyOrders() {
    const list = document.getElementById("orders-list");
    if(!list) return;

    list.innerHTML = "<p>Carregando pedidos...</p>";
    
    try {
        const response = await fetch(`${API_URL}/orders`); 
        
        if (!response.ok) {
            throw new Error(`Erro API: ${response.status}`);
        }
        
        const allOrders = await response.json();
        renderOrdersList(allOrders);

    } catch (error) {
        console.error("Erro:", error);
        list.innerHTML = `<p style="color:red; padding:20px; text-align:center">
            Erro ao conectar: ${error.message}
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
        const statusClass = order.status ? order.status.toLowerCase() : 'new';

        const card = document.createElement('div');
        card.className = `order-card status-${statusClass}`;
        
        card.innerHTML = `
            <div class="order-info">
                <h3>Pedido #${order.id}</h3>
                <span class="order-date">Data: ${date}</span> <br>
                <strong>Status: ${translateStatus(order.status)}</strong>
            </div>
            
            <div style="text-align:right">
                <div style="font-weight:bold; margin-bottom:5px; font-size:1.2rem">${formatCurrency(order.totalCents)}</div>
                <button class="btn-details">Ver Detalhes</button>
            </div>
        `;

        card.querySelector('.btn-details').addEventListener('click', () => openOrderDetails(order.id));

        list.appendChild(card);
    });
}

export async function openOrderDetails(orderId) {
    const modalBody = document.getElementById("modal-body");
    const modal = document.getElementById("order-modal");
    
    modalBody.innerHTML = "<p>Carregando...</p>";
    modal.classList.remove("hidden");

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if(!response.ok) throw new Error("Erro ao carregar detalhes");
        const order = await response.json();

        renderOrderDetailsModal(order, modalBody);

    } catch (e) {
        console.error(e);
        modalBody.innerHTML = `<p style="color:red">Erro: ${e.message}</p>`;
    }
}

function renderOrderDetailsModal(order, container) {
    const totalCents = order.totalCents;
    const paidCents = order.totalPaidCents || 0; 
    const remainingCents = totalCents - paidCents;
    const remainingFloat = remainingCents / 100;

    let historyRows = "";
    if (order.payments && order.payments.length > 0) {
        order.payments.forEach(pay => {
            const pDate = pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('pt-BR') : '-';
            historyRows += `
                <tr>
                    <td data-title="Data:">${pDate}</td>
                    <td data-title="Método:">${pay.method}</td>
                    <td data-title="Valor:" style="font-weight:bold; color:#27ae60;">${formatCurrency(pay.amountCents)}</td>
                </tr>
            `;
        });
    } else {
        historyRows = `<tr class="no-data"><td colspan="3">Nenhum pagamento registrado.</td></tr>`;
    }

    let itemsHtml = "";
    if(order.items) {
        itemsHtml = order.items.map(item => `
            <tr>
                <td data-title="Produto:">${item.productName}</td>
                <td data-title="Preço:">${formatCurrency(item.unitPriceCents)}</td>
                <td data-title="Quantidade:" align="center">${item.quantity}</td>
                <td data-title="Subtotal:" align="right">${formatCurrency(item.totalCents)}</td>
            </tr>
        `).join('');
    }

    let controlsHtml = "";

    if (order.status === "CANCELLED") {
        controlsHtml = `
            <div style="margin-top:20px; padding:15px; background:#fdedec; border:1px solid #c0392b; color:#c0392b; text-align:center; border-radius:5px;">
                🚫 <strong>PEDIDO CANCELADO</strong>
                ${paidCents > 0 ? `<br><small>Houve pagamentos de ${formatCurrency(paidCents)}. Status: Estorno Pendente.</small>` : ''}
            </div>
        `;
    } 
    else if (remainingCents <= 0 || order.status === "PAID") {
        controlsHtml = `
            <div style="margin-top:20px; padding:15px; background:#e8f8f5; border:1px solid #27ae60; color:#27ae60; text-align:center; border-radius:5px;">
                ✅ <strong>PEDIDO QUITADO</strong><br>
                Total pago: ${formatCurrency(paidCents)}
            </div>
        `;
    } 
    else {
        let refundMsg = "";
        if (paidCents > 0) {
            refundMsg = `<div class="warning-box">⚠️ Ao cancelar, o valor já pago de <strong>${formatCurrency(paidCents)}</strong> entrará em processo de estorno.</div>`;
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
                            <option value="CARD">💳 CARTÃO</option>
                            <option value="BOLETO">🧾 Boleto</option>
                        </select>
                    </div>
                </div>

                <div class="modal-actions">
                    <button id="btn-pay-action" class="btn-pay">Pagar</button>
                    <button id="btn-cancel-action" class="btn-cancel">Cancelar Pedido</button>
                </div>
                ${refundMsg}
            </div>
        `;
    }

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2>Pedido #${order.id}</h2>
            <span class="status-badge status-${order.status.toLowerCase()}">${translateStatus(order.status)}</span>
        </div>
        <p><strong>Cliente:</strong> ${order.customerName}</p>

        <div class="payment-history-container">
            <details ${paidCents > 0 ? 'open' : ''}>
                <summary class="payment-history-summary">
                    <span>Histórico de Pagamentos</span>
                    <span style="font-size:0.8rem; color:#27ae60">Total Pago: ${formatCurrency(paidCents)}</span>
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
            <span>Restante: <span style="color:#c0392b">${formatCurrency(remainingCents)}</span></span>
            <span>Total Pedido: ${formatCurrency(order.totalCents)}</span>
        </div>
        
        ${controlsHtml}
    `;

    const payBtn = document.getElementById("btn-pay-action");
    if(payBtn) {
        payBtn.addEventListener("click", () => makePayment(order.id));
    }

    const cancelBtn = document.getElementById("btn-cancel-action");
    if(cancelBtn) {
        cancelBtn.addEventListener("click", () => cancelOrder(order.id, paidCents));
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
            alert("Não foi possível cancelar. Verifique se o pedido já não foi pago.");
        }
    } catch (error) {
        alert("Erro de conexão: " + error.message);
    }
}

async function makePayment(orderId) {
    const amountInput = document.getElementById("payAmountInput");
    const methodInput = document.getElementById("payMethodInput");
    
    if (!amountInput || !methodInput) return;

    const valorFloat = parseFloat(amountInput.value);
    const method = methodInput.value;
    const amountCents = Math.round(valorFloat * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
        alert("Por favor, digite um valor válido maior que zero.");
        return;
    }

    if(!confirm(`Confirma o pagamento de R$ ${valorFloat.toFixed(2)} via ${method}?`)) {
        return;
    }

    const paymentData = {
        orderId: orderId,
        amountCents: amountCents,
        method: method
    };

    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            alert("✅ Pagamento registrado com sucesso!");
            openOrderDetails(orderId);
            loadMyOrders(); 
        } else {
            const errorText = await response.text(); 
            try {
                const errJson = JSON.parse(errorText);
                alert("Erro ao pagar: " + (errJson.message || errorText));
            } catch {
                alert("Erro ao pagar: " + errorText);
            }
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão: " + e.message);
    }
}

export function closeModal() {
    document.getElementById("order-modal").classList.add("hidden");
}