// Product data
const products = [
    {
        id: 1,
        name: "Annihilator Tee",
        price: 180,
        category: "tshirt",
        sizes: ["S", "M", "L", "XL"],
        image: "images/annihilator_tee.jpg"
    },
    {
        id: 2,
        name: "Riffcore Longsleeve",
        price: 220,
        category: "tshirt",
        sizes: ["S", "M", "L"],
        image: "images/riffcore_longsleeve.jpg"
    },
    {
        id: 3,
        name: "Skull Thrash Tee",
        price: 200,
        category: "tshirt",
        sizes: ["S", "M", "L", "XL"],
        image: "images/skull_thrash_tee.jpg"
    },
    {
        id: 4,
        name: "Barbed Wire Logo Tee",
        price: 190,
        category: "tshirt",
        sizes: ["S", "M", "L", "XL"],
        image: "images/barbed_wire_logo_tee.jpg"
    },
    {
        id: 5,
        name: "Tour Hoodie",
        price: 350,
        category: "hoodie",
        sizes: ["M", "L", "XL"],
        image: "images/tour_hoodie.jpg"
    },
    {
        id: 6,
        name: "Inferno Hoodie",
        price: 370,
        category: "hoodie",
        sizes: ["M", "L", "XL"],
        image: "images/inferno_hoodie.jpg"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('metalBazaarCart')) || [];

// DOM elements
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartPanel = document.getElementById('cart-panel');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total-amount');
const cartCount = document.getElementById('cart-count');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const cancelCheckout = document.getElementById('cancel-checkout');
const checkoutForm = document.getElementById('checkout-form');
const orderSummaryItems = document.getElementById('order-summary-items');
const orderSummaryTotal = document.getElementById('order-summary-total');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    updateCartUI();

    // Event listeners
    searchInput.addEventListener('input', handleSearch);

    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });

    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', openCheckoutModal);
    cancelCheckout.addEventListener('click', closeCheckoutModal);
    checkoutForm.addEventListener('submit', handleCheckout);
});

// Render products to the page
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;

        const sizeOptions = product.sizes.map(size =>
            `<option value="${size}">${size}</option>`
        ).join('');

        productCard.innerHTML = `
            <div class="product-image">${product.name}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">MAD ${product.price}</p>
            <select class="product-size">
                <option value="">Select size</option>
                ${sizeOptions}
            </select>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        productsContainer.appendChild(productCard);
    });

    // Add event listeners to the Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;

    let filteredProducts = products;

    // Apply category filter
    if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === activeCategory);
    }

    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filteredProducts);
}

// Handle category filtering
function handleFilter(e) {
    const category = e.target.dataset.category;

    // Update active button
    filterButtons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');

    // Filter products
    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = products;

    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filteredProducts);
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const productCard = e.target.closest('.product-card');
    const sizeSelect = productCard.querySelector('.product-size');
    const selectedSize = sizeSelect.value;

    if (!selectedSize) {
        showToast('Please select a size');
        return;
    }

    const product = products.find(p => p.id === productId);

    // Check if product with same size is already in cart
    const existingItemIndex = cart.findIndex(item =>
        item.id === productId && item.size === selectedSize
    );

    if (existingItemIndex !== -1) {
        // Increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1,
            image: product.image
        });
    }

    // Save to localStorage
    localStorage.setItem('metalBazaarCart', JSON.stringify(cart));

    // Update UI
    updateCartUI();
    showToast('Added to cart');

    // Reset size selection
    sizeSelect.value = '';
}

// Update cart UI
function updateCartUI() {
    // Update cart items
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-image">${item.name}</div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-price">MAD ${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;

            cartItems.appendChild(cartItem);
        });

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Update cart total and count
    const total = calculateTotal();
    cartTotal.textContent = `MAD ${total}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Toggle cart panel
function toggleCart() {
    cartPanel.classList.toggle('open');
}

// Decrease item quantity
function decreaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem('metalBazaarCart', JSON.stringify(cart));
    updateCartUI();
}

// Increase item quantity
function increaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    cart[index].quantity += 1;

    localStorage.setItem('metalBazaarCart', JSON.stringify(cart));
    updateCartUI();
}

// Remove item from cart
function removeItem(e) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);

    localStorage.setItem('metalBazaarCart', JSON.stringify(cart));
    updateCartUI();
    showToast('Item removed from cart');
}

// Open checkout modal
function openCheckoutModal() {
    // Update order summary
    orderSummaryItems.innerHTML = '';

    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'order-summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} (${item.size}) x${item.quantity}</span>
            <span>MAD ${item.price * item.quantity}</span>
        `;
        orderSummaryItems.appendChild(summaryItem);
    });

    orderSummaryTotal.textContent = `MAD ${calculateTotal()}`;

    // Show modal
    checkoutModal.classList.add('open');
}

// Close checkout modal
function closeCheckoutModal() {
    checkoutModal.classList.remove('open');
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const notes = document.getElementById('order-notes').value;
    const total = calculateTotal();

    // Format WhatsApp message
    let message = `🖤 NEW ORDER - Kustom Metal Bazaar 🖤\n\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `Items:\n`;

    cart.forEach((item, index) => {
        message += `${index + 1}) ${item.name} - Size ${item.size} - Qty ${item.quantity}\n`;
    });

    message += `\nNotes: ${notes || 'None'}\n`;
    message += `Total: MAD ${total}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number (replace with actual number)
    const whatsappNumber = '212600000000';

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Try to open WhatsApp
    const newWindow = window.open(whatsappURL, '_blank');

    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert('WhatsApp could not be opened. Order details have been copied to clipboard.');
        }).catch(err => {
            alert('Could not open WhatsApp or copy to clipboard. Please manually send your order details.');
            console.error('Could not copy text: ', err);
        });
    }

    // Clear cart and close modal
    cart = [];
    localStorage.removeItem('metalBazaarCart');
    updateCartUI();
    closeCheckoutModal();
    showToast('Order sent successfully!');

    // Reset form
    checkoutForm.reset();
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
