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

// --- ESTADO DEL CARRITO Y PEDIDO ---
let cart = [];
let currentSelectedProduct = null;
let currentModalQty = 1;
let deliveryType = 'pickup'; // 'pickup' por defecto[cite: 11]

// --- VARIABLES PARA EL MAPA (LEAFLET) ---
let map = null;
let marker = null;
let selectedLat = 10.1500; // Coordenadas de referencia o por defecto (puedes ajustarlas)
let selectedLng = -67.4167;

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
    checkStoreStatus();
    setInterval(checkStoreStatus, 60000);
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
                <div class="h-48 overflow-hidden relative cursor-pointer group" onclick="openImageModal('${product.image}', '${product.name}')">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-sm">
                        <i class="fa-solid fa-magnifying-glass-plus text-2xl"></i>
                    </div>
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
                <button onclick="openProductModal(${product.id})" class="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition shadow">
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

    // Mostrar u ocultar datos de pago móvil según la selección
    const clientPaymentSelect = document.getElementById('clientPayment');
    const paymentDetailsContainer = document.getElementById('paymentDetailsContainer');

    if (clientPaymentSelect && paymentDetailsContainer) {
        clientPaymentSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Pago Móvil / Transferencia') {
                paymentDetailsContainer.classList.remove('hidden');
            } else {
                paymentDetailsContainer.classList.add('hidden');
                const clientRefInput = document.getElementById('clientRef');
                if (clientRefInput) clientRefInput.value = '';
            }
        });
    }

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

// --- CONTROL DE VENTANA MODAL DE CHECKOUT ---
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    // Sincronizar el total con el modal de checkout
    document.getElementById('checkoutModalTotal').textContent = cartTotal.textContent;
    document.getElementById('checkoutModal').classList.remove('hidden');
    // Cerrar el panel lateral del carrito
    toggleCart();
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.add('hidden');
}

// --- GESTIÓN DE TIPO DE ENTREGA (PICK UP / DELIVERY) Y MAPA ---
function setDeliveryType(type) {
    deliveryType = type;
    const btnPickup = document.getElementById('btnPickup');
    const btnDelivery = document.getElementById('btnDelivery');
    const deliveryContainer = document.getElementById('deliveryContainer');

    if (type === 'pickup') {
        // Estilo botón Pick Up activo
        btnPickup.className = "py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center space-x-2 bg-amber-500 text-slate-900 border-amber-500 shadow-sm";
        // Estilo botón Delivery inactivo
        btnDelivery.className = "py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center space-x-2 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm";
        
        // Ocultar contenedor de dirección y mapa
        deliveryContainer.classList.add('hidden');
        document.getElementById('clientAddress').removeAttribute('required');
    } else {
        // Estilo botón Delivery activo
        btnDelivery.className = "py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center space-x-2 bg-amber-500 text-slate-900 border-amber-500 shadow-sm";
        // Estilo botón Pick Up inactivo
        btnPickup.className = "py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center space-x-2 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm";
        
        // Mostrar contenedor de dirección y mapa
        deliveryContainer.classList.remove('hidden');
        document.getElementById('clientAddress').setAttribute('required', 'true');

        // Inicializar mapa de Leaflet si no se ha creado aún
        setTimeout(() => {
            initMap();
        }, 200);
    }
}

function initMap() {
    if (map) {
        map.invalidateSize();
        return;
    }

    try {
        map = L.map('map').setView([selectedLat, selectedLng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        marker = L.marker([selectedLat, selectedLng], { draggable: true }).addTo(map);

        marker.on('dragend', function (e) {
            const position = marker.getLatLng();
            selectedLat = position.lat;
            selectedLng = position.lng;
        });

        // Intentar obtener geolocalización del usuario si el navegador lo permite
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                selectedLat = position.coords.latitude;
                selectedLng = position.coords.longitude;
                map.setView([selectedLat, selectedLng], 16);
                marker.setLatLng([selectedLat, selectedLng]);
            }, () => {
                console.log("Geolocalización no disponible o denegada.");
            });
        }
    } catch (error) {
        console.error("Error al inicializar Leaflet:", error);
    }
}

// --- MODAL DE PRODUCTO (PERSONALIZACIÓN, NOTAS Y CANTIDAD) ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentSelectedProduct = product;
    currentModalQty = 1; // Reiniciar cantidad a 1

    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalProductDesc').textContent = product.description || '';
    document.getElementById('modalProductNotes').value = ''; // Limpiar notas previas
    document.getElementById('modalProductQty').textContent = currentModalQty;

    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    currentSelectedProduct = null;
}

function adjustModalQuantity(change) {
    currentModalQty += change;
    if (currentModalQty < 1) {
        currentModalQty = 1;
    }
    document.getElementById('modalProductQty').textContent = currentModalQty;
}

function confirmAddToCart() {
    if (!currentSelectedProduct) return;

    playBeepSound(); // Suena el bip de confirmación

    const notes = document.getElementById('modalProductNotes').value.trim();
    
    // Crear ID único combinando producto y notas para agrupar o separar según instrucciones
    const cartItemId = `${currentSelectedProduct.id}-${notes}`;
    
    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity += currentModalQty;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: currentSelectedProduct.id,
            name: currentSelectedProduct.name,
            price: currentSelectedProduct.price,
            quantity: currentModalQty,
            notes: notes
        });
    }

    updateCartUI();
    closeProductModal();
}

// --- CAMBIAR CANTIDAD EN EL CARRITO ---
function changeQuantity(cartItemId, change) {
    const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
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
        div.className = 'py-3 flex items-center justify-between border-b border-slate-100 last:border-0';
        div.innerHTML = `
            <div class="flex-1 pr-2">
                <h4 class="font-bold text-sm text-slate-900">${item.name}</h4>
                <p class="text-xs text-amber-600 font-semibold">$${item.price.toFixed(2)} c/u</p>
                ${item.notes ? `<p class="text-xs text-slate-500 italic mt-0.5">Nota: ${item.notes}</p>` : ''}
            </div>
            <div class="flex items-center space-x-2">
                <button type="button" onclick="changeQuantity('${item.cartItemId}', -1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 transition">-</button>
                <span class="text-sm font-bold w-5 text-center">${item.quantity}</span>
                <button type="button" onclick="changeQuantity('${item.cartItemId}', 1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 transition">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- CONTROL DE VENTANA MODAL DE PAGO MÓVIL ---
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const modalTotalAmount = document.getElementById('modalTotalAmount');
    
    modalTotalAmount.textContent = cartTotal.textContent;
    modal.classList.remove('hidden');
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.add('hidden');
}

// --- ENVIAR PEDIDO A WHATSAPP ---
function sendOrderToWhatsApp() {
    playOrderSound(); // Sonido de timbre de restaurante

    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const name = document.getElementById('clientName').value.trim();
    const payment = document.getElementById('clientPayment').value;
    const clientRefInput = document.getElementById('clientRef');
    const clientRef = clientRefInput ? clientRefInput.value.trim() : '';
    const notes = document.getElementById('clientNotes').value.trim();

    let message = `*¡Hola! Quiero hacer un nuevo pedido 🍔*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `🛍️ *Tipo de Entrega:* ${deliveryType === 'pickup' ? 'Pick Up (Retiro en local)' : 'Delivery (Envío a domicilio)'}\n`;

    if (deliveryType === 'delivery') {
        const address = document.getElementById('clientAddress').value.trim();
        message += `📍 *Dirección:* ${address}\n`;
        message += `🗺️ *Ubicación GPS:* https://maps.google.com/?q=${selectedLat},${selectedLng}\n`;
    }

    message += `💳 *Método de Pago:* ${payment}\n`;
    
    if (payment === 'Pago Móvil / Transferencia' && clientRef) {
        message += `🔢 *Últimos 4 dígitos:* ${clientRef}\n`;
    }
    
    if (notes) {
        message += `📝 *Notas generales:* ${notes}\n`;
    }
    message += `\n-----------------------------------\n`;
    message += `📋 *DETALLE DEL PEDIDO:*\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.quantity}x ${item.name} - $${subtotal.toFixed(2)}`;
        if (item.notes) {
            message += `\n   _Instrucción: ${item.notes}_`;
        }
        message += `\n`;
    });

    message += `-----------------------------------\n`;
    message += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*\n\n`;
    message += `¡Quedo atento a la confirmación de mi pedido!`;

    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        submitBtn.classList.add('bg-red-600', 'text-white');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>¡Pedido Enviado!</span>`;

        setTimeout(() => {
            submitBtn.classList.remove('bg-red-600');
            submitBtn.classList.add('bg-emerald-600');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 30000);
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        closeCheckoutModal(); // Cierra el modal de checkout al enviar
    }, 400);
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

// --- FUNCIÓN DE SONIDO LLAMATIVO (TIMBRE DE PEDIDO LISTO) ---
function playOrderSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1567.98, ctx.currentTime);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);

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
        }, 150);
        
    } catch (e) {
        console.log("Audio bloqueado.", e);
    }
}

// --- ABRIR MODAL DE IMAGEN ---
function openImageModal(imageSrc, productName) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');

    modalImage.src = imageSrc;
    modalTitle.textContent = productName;
    modal.classList.remove('hidden');
}

// --- CERRAR MODAL DE IMAGEN ---
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
}

// --- VERIFICAR SI EL LOCAL ESTÁ ABIERTO O CERRADO (5:00 PM A 11:00 PM) ---
function checkStoreStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (!statusDot || !statusText) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const openingTime = 17 * 60; 
    const closingTime = 23 * 60; 

    const isOpen = currentTimeInMinutes >= openingTime && currentTimeInMinutes < closingTime;

    if (isOpen) {
        statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
        statusText.textContent = "Abierto (Cierra a las 11:00 PM)";
        statusText.className = "text-emerald-700 font-bold";
    } else {
        statusDot.className = "w-2.5 h-2.5 rounded-full bg-red-500";
        statusText.textContent = "Cerrado (Abre a las 5:00 PM)";
        statusText.className = "text-red-700 font-bold";
    }
}
// --- FUNCIÓN PARA COPIAR DATOS AL PORTAPAPELES ---
function copyToClipboard(elementId, btnElement) {
    const textToCopy = document.getElementById(elementId).innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Cambiar icono temporalmente a un Check para indicar éxito
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fa-solid fa-check text-emerald-600"></i>`;
        btnElement.classList.add('border-emerald-400', 'bg-emerald-50');

        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.classList.remove('border-emerald-400', 'bg-emerald-50');
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar al portapapeles: ', err);
        alert('No se pudo copiar el texto automáticamente.');
    });
}