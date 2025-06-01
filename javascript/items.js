fetch('javascript/products.json')
  .then(response => response.json())
  .then(cards => {
    const featuresRow = document.getElementById('features-row');
    cards.forEach((card, idx) => {
        featuresRow.innerHTML += `
            <div class="col-4 col-12-medium">
                <section class="box feature">
                    <a href="#" class="image featured"><img src="${card.img}" alt="" /></a>
                    <div class="inner">
                        <header>
                            <h2>${card.title}</h2>
                            <p>${card.subtitle}</p>
                        </header>
                        <p>${card.desc}</p>
                        <label>Size:
                            <select id="size-${idx}">
                                ${card.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </label>
                        <label>Quantity:
                            <select id="qty-${idx}">
                                ${[...Array(10).keys()].map(i => `<option value="${i+1}">${i+1}</option>`).join('')}
                            </select>
                        </label>
                        <button onclick="addToCart(${idx})">Add to Cart</button>
                    </div>
                </section>
            </div>
        `;
    });

    // Store cards globally for addToCart
    window.cards = cards;
  });


// Cart logic
window.addToCart = function(idx) {
    const size = document.getElementById(`size-${idx}`).value;
    const qty = document.getElementById(`qty-${idx}`).value;
    const item = {
        title: cards[idx].title,
        size,
        qty,
    };
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.qty} x ${item.title} (${item.size}) added to cart!`);
}

// Simple cart display and submit
function showCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    let msg = cart.map(item => `${item.qty} x ${item.title} (${item.size})`).join('\n');
    alert("Cart:\n" + msg);
}

function submitCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    // For now, just show the cart. Email sending can be added later.
    alert("Submitting cart:\n" + cart.map(item => `${item.qty} x ${item.title} (${item.size})`).join('\n'));
    localStorage.removeItem('cart');
}

// Add cart buttons to page
// const cartButtons = document.createElement('div');
// cartButtons.innerHTML = `
//     <button onclick="showCart()">View Cart</button>
//     <button onclick="submitCart()">Submit Cart</button>
// `;
// document.getElementById('features-wrapper').prepend(cartButtons);

window.openCart = function() {
    const overlay = document.getElementById('cart-overlay');
    const cartItemsDiv = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsDiv.innerHTML = cart.map((item, idx) => `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:6px;">
                <span style="font-size:1rem;">${item.qty} x ${item.title} (${item.size})</span>
                <button onclick="removeFromCart(${idx})" title="Remove" style="background:none; border:none; color:#dc3545; font-size:1.1rem; cursor:pointer; margin-left:10px;">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    overlay.style.display = "block";
};

window.closeCart = function() {
    document.getElementById('cart-overlay').style.display = "none";
};

window.removeFromCart = function(idx) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(idx, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    openCart();
};

window.submitCart = function() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Submitting cart:\n" + cart.map(item => `${item.qty} x ${item.title} (${item.size})`).join('\n'));
    localStorage.removeItem('cart');
    closeCart();
};

// Attach openCart to the button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('open-cart-btn').onclick = openCart;
});