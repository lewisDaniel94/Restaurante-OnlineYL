// --- CONFIGURACIÓN DE TU NEGOCIO ---
const WHATSAPP_NUMBER = "584126613818"; 

// --- BASE DE DATOS DE PRODUCTOS ---
const products = [
    {
        id: 1,
        name: "Hamburguesa Clásica Monsther",
        category: "hamburguesas",
        price: 8.99,
        description: "Carne 100% de res, queso cheddar fundido, lechuga, tomate y salsa especial de la casa.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Hamburguesa Doble Bacon",
        category: "hamburguesas",
        price: 11.50,
        description: "Doble carne, tocino crujiente ahumado, doble ración de queso americano y cebolla caramelizada.",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Pizza Pepperoni Suprema",
        category: "pizzas",
        price: 13.99,
        description: "Masa artesanal crujiente, salsa de tomate natural, abundante queso mozzarella y rodajas de pepperoni premium.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Pizza Hawaiana Tropical",
        category: "pizzas",
        price: 12.50,
        description: "La combinación perfecta de jamón de alta calidad, piña dulce jugosa y extra queso fundido.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Salchipapa Especial de la Casa",
        category: "salchipapas",
        price: 7.50,
        description: "Papas fritas doradas, rodajas de salchicha alemana, queso costeño rallado, salsas y trocitos de tocino.",
        image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Salchipapa Mixta Pollo y Carne",
        category: "salchipapas",
        price: 9.99,
        description: "Papas fritas con salchicha, jugosos trozos de pollo a la plancha, carne desmechada y salsas variadas.",
        image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Jugo Natural de parchita (Maracuyá)",
        category: "bebidas",
        price: 2.50,
        description: "Refrescante jugo natural de fruta fresca recién exprimida, preparado al momento.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Coca-Cola 1.5 Litros",
        category: "bebidas",
        price: 3.00,
        description: "Bebida gaseosa bien fría para compartir.",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
    }
];

// --- ESTADO DEL CARRITO ---
let cart = [];
let currentOrderData = null; // Guardar datos temporalmente para el pago

// --- ELEMENTOS DEL DOM ---
const productGrid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const checkoutForm = document.getElementById('checkoutForm');
const actionButtonsContainer = document.getElementById('actionButtonsContainer');

// Modal Elements
const bankModal = document.getElementById('bankModal');
const closeBankModal = document.getElementById('closeBankModal');
const modalTotalAmount = document.getElementById('modalTotalAmount');
const paymentRefForm = document.getElementById('paymentRefForm');

// --- INICIALIZAR LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
});

// --- RENDERIZAR PRODUCTOS ---
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-slate-400">
                <i class="fa-solid fa-face-sad-tear text-4xl mb-2"></i>
                <p>No se encontraron platillos o bebidas.</p>
            </div>
        `;
        return;
    }

    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between';
        
        card.innerHTML = `
            <div>
                <div class="h-48 overflow-hidden relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                        ${product.category}
                    </span>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-lg text-slate-900 mb-1">${product.name}</h3>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">${product.description}</p>
                </div>
            </div>
            <div class="px-5 pb-5 flex items-center justify-between">
                <span class="text-xl font-extrabold text-amber-600">$${product.price.toFixed(2)}</span>
                <button onclick="addToCart(${product.id})" class="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition shadow">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Agregar</span>
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// --- CONFIGURAR EVENTOS ---
function setupEventListeners() {
    openCartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            categoryButtons.forEach(btn => btn.classList.remove('active', 'bg-amber-500', 'text-slate-900'));
            categoryButtons.forEach(btn => btn.classList.add('bg-white', 'text-slate-600'));
            
            e.target.classList.remove('bg-white', 'text-slate-600');
            e.target.classList.add('active', 'bg-amber-500', 'text-slate-900');

            const category = e.target.getAttribute('data-category');
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                displayProducts(filtered);
            }
        });
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
        displayProducts(filtered);
    });

    // Paso 1: Enviar pedido y revelar botón de Pagar
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrderAndShowPayButton();
    });

    // Cerrar modal de banco
    closeBankModal.addEventListener('click', () => {
        bankModal.classList.add('hidden');
    });

    // Paso 2: Enviar pago por WhatsApp con referencia
    paymentRefForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendPaymentProofToWhatsApp();
    });
}

function toggleCart() {
    cartDrawer.classList.toggle('hidden');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    if(cartDrawer.classList.contains('hidden')) {
        toggleCart();
    }
}

function changeQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            // Si vaciamos el carrito, restablecemos los botones
            resetCheckoutButtons();
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-slate-400 py-8">Tu carrito está vacío</p>`;
        cartTotal.textContent = "$0.00";
        resetCheckoutButtons();
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const div = document.createElement('div');
        div.className = 'py-3 flex items-center justify-between';
        div.innerHTML = `
            <div class="flex-1 pr-2">
                <h4 class="font-bold text-sm text-slate-900">${item.name}</h4>
                <p class="text-xs text-amber-600 font-semibold">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="changeQuantity(${item.id}, -1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 transition">-</button>
                <span class="text-sm font-bold w-5 text-center">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 transition">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- PASO 1: ENVIAR PEDIDO Y MOSTRAR BOTÓN "PAGAR" ---
function processOrderAndShowPayButton() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const name = document.getElementById('clientName').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const payment = document.getElementById('clientPayment').value;
    const notes = document.getElementById('clientNotes').value.trim();

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Guardar datos temporalmente
    currentOrderData = { name, address, payment, notes, total };

    // 1. Enviar el pedido por WhatsApp
    let message = `*¡Hola! Acabo de hacer un pedido 🍔*

`;
    message += `👤 *Cliente:* ${name}
`;
    message += `📍 *Dirección:* ${address}
`;
    message += `💳 *Método de Pago:* ${payment}
`;
    if (notes) message += `📝 *Notas:* ${notes}
`;
    message += `
-----------------------------------
`;
    message += `📋 *DETALLE DEL PEDIDO:*
`;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        message += `• ${item.quantity}x ${item.name} - $${subtotal.toFixed(2)}
`;
    });

    message += `-----------------------------------
`;
    message += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*

`;
    message += `(Pedido enviado, procederé a registrar el pago).`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // 2. Transformar el botón de envío en el botón "Pagar"
    actionButtonsContainer.innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs mb-2">
            <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> ¡Pedido enviado por WhatsApp con éxito!
        </div>
        <button type="button" onclick="openBankDetailsModal()" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg">
            <i class="fa-solid fa-credit-card text-lg"></i>
            <span>Pagar (Ver Datos Bancarios)</span>
        </button>
    `;
}

// Restablecer botones si se vacía el carrito
function resetCheckoutButtons() {
    actionButtonsContainer.innerHTML = `
        <button type="submit" id="sendOrderBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg">
            <i class="fa-brands fa-whatsapp text-xl"></i>
            <span>1. Enviar Pedido por WhatsApp</span>
        </button>
    `;
}

// --- ABRIR MODAL CON DATOS BANCARIOS ---
function openBankDetailsModal() {
    if (!currentOrderData) return;
    modalTotalAmount.textContent = `$${currentOrderData.total.toFixed(2)}`;
    bankModal.classList.remove('hidden');
}

// --- PASO 2: ENVIAR COMPROBANTE/PAGO POR WHATSAPP ---
function sendPaymentProofToWhatsApp() {
    const paymentRef = document.getElementById('paymentRef').value.trim();
    if (!paymentRef) {
        alert("Por favor ingresa los datos de la referencia de pago.");
        return;
    }

    let message = `*¡Comprobante de Pago Enviado! 🧾*

`;
    message += `👤 *Cliente:* ${currentOrderData.name}
`;
    message += `💰 *Monto Pagado:* $${currentOrderData.total.toFixed(2)}
`;
    message += `🔢 *Referencia / Teléfono:* ${paymentRef}
`;
    message += `🏦 *Banco:* Banco Mercantil (Pago Móvil)

`;
    message += `¡Quedo a la espera de la verificación de mi pago y entrega!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // Cerrar modal y limpiar
    bankModal.classList.add('hidden');
    cart = [];
    updateCartUI();
    toggleCart();
    alert("¡Pago reportado con éxito! Gracias por tu compra.");
}