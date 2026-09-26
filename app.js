// --- CONFIGURACIÓN DE TU NEGOCIO ---
// Reemplaza este número con tu número de WhatsApp real (incluyendo código de país, sin signos + ni espacios)
const WHATSAPP_NUMBER = "584126613818"; 

// --- BASE DE DATOS DE PRODUCTOS ---
const products = [
    {
        id: 1,
        name: "Hamburguesa Clásica Monsther",
        category: "hamburguesas",
        price: 8.99,
        description: "Carne 100% de res, queso cheddar fundido, lechuga, tomate y salsa especial de la casa.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjVJXuQhhCwwvg049KMbTOXWiiLvKJyVuaIZ4uqK_e5igHDSH7C_3_AU&s=10"
        
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

// --- INICIALIZAR LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
});

// --- RENDERIZAR PRODUCTOS EN PANTALLA ---
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
    // Abrir y cerrar carrito
    openCartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Filtrar por categorías
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

    // Buscador en tiempo real
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
        displayProducts(filtered);
    });

    // Enviar pedido por WhatsApp
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendOrderToWhatsApp();
    });
}

// --- ABRIR / CERRAR CARRITO ---
function toggleCart() {
    cartDrawer.classList.toggle('hidden');
}

// --- AGREGAR PRODUCTO AL CARRITO ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Abrir el carrito automáticamente al agregar un producto (opcional, da gran experiencia de usuario)
    if(cartDrawer.classList.contains('hidden')) {
        toggleCart();
    }
}

// --- CAMBIAR CANTIDAD EN EL CARRITO ---
function changeQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

// --- ACTUALIZAR LA VISTA DEL CARRITO ---
function updateCartUI() {
    // Actualizar contador flotante
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-slate-400 py-8">Tu carrito está vacío</p>`;
        cartTotal.textContent = "$0.00";
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

// --- ENVIAR PEDIDO A WHATSAPP ---
function sendOrderToWhatsApp() {
    playOrderSound();
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const name = document.getElementById('clientName').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const payment = document.getElementById('clientPayment').value;
    const notes = document.getElementById('clientNotes').value.trim();

    let message = `*¡Hola! Quiero hacer un nuevo pedido 🍔*

`;
    message += `👤 *Cliente:* ${name}
`;
    message += `📍 *Dirección:* ${address}
`;
    message += `💳 *Método de Pago:* ${payment}
`;
    if (notes) {
        message += `📝 *Notas:* ${notes}
`;
    }
    message += `
-----------------------------------
`;
    message += `📋 *DETALLE DEL PEDIDO:*
`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.quantity}x ${item.name} - $${subtotal.toFixed(2)}
`;
    });

    message += `-----------------------------------
`;
    message += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*

`;
    message += `¡Quedo atento a la confirmación de mi pedido!`;

    // Codificar el mensaje para URL de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, '_blank');
}

// --- FUNCIÓN DE AUDIO DIGITAL (BEEP) ---
function playBeepSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine'; 
        oscillator.frequency.setValueAtTime(587.33, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
        console.log("Audio bloqueado temporalmente hasta la interacción del usuario.", e);
    }
}

// --- AGREGAR PRODUCTO AL CARRITO ---
function addToCart(productId) {
    playBeepSound(); // <--- ¡Coloca solo esta línea aquí!

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
// --- FUNCIÓN DE SONIDO LLAMATIVO (TIMBRE DE PEDIDO LISTO) ---
function playOrderSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Primer "Ding" de la campana
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1567.98, ctx.currentTime); // Nota aguda (G6)
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);

        // Segundo "Ding" (con un poco más de eco)
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1567.98, ctx.currentTime); 
            gain2.gain.setValueAtTime(0.3, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.8);
        }, 150); // Suena 150 milisegundos después del primero
        
    } catch (e) {
        console.log("Audio bloqueado.", e);
    }
}
