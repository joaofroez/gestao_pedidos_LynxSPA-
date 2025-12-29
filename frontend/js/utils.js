export function formatCurrency(valueInCents) {
    if (valueInCents === null || valueInCents === undefined) return "R$ 0,00";
    return (valueInCents / 100).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}

export function translateStatus(status) {
    const map = {
        'NEW': 'Aguardando Pagamento',
        'PAID': 'Pago',
        'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
}

export function showToast(msg, type = 'success') {
    let container = document.getElementById('toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '⚠️';
    
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}