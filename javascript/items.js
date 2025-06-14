fetch('javascript/products.json')
  .then(response => response.json())
  .then(cards => {
    const featuresRow = document.getElementById('features-row');
    featuresRow.innerHTML = '';
    cards.forEach((card, idx) => {
      featuresRow.innerHTML += `
 <div class="product-card" style="margin: 0 1.5px 16px 0;">
  <section class="box feature" style="padding: 0.5em;">
    <div class="image featured" style="cursor:pointer; height:220px; overflow:hidden;" onclick="showProductModal(${idx})">
      <img src="${card.img}" alt="${card.title}" style="width:100%; height:100%; object-fit:cover; object-position:center; display:block; border-radius:0;" />
    </div>
    <div class="inner" style="padding: 0 0 1em 0; background:#f5f5f5;">
  <div style="width:100%; margin-bottom:8px; display:flex; justify-content:center;">
  <select id="size-val-${idx}" style="
    width:90%;
    padding:7px 12px;
    border:1px solid #d1d5db;
    border-radius:6px;
    background:#f5f5f5;
    font-size:1em;
    color:#222;
    outline:none;
    margin:0 auto;
    display:block;
  ">
    ${card.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
  </select>
</div>
  <div style="padding-left: 1em;padding-top: 1em;">
    <h2 style="font-size:1.20em; font-weight:400; margin:0 0 4px 0; padding:0;">
  ${card.title.length > 22 ? card.title.slice(0, 22) + '...' : card.title}
</h2>
</header>
<p style="font-size:0.90em; margin:0; padding:0;">
  ${card.subtitle.length > 25 ? card.subtitle.slice(0, 25) + '...' : card.subtitle}
</p>
    <input type="hidden" id="size-val-${idx}" value="${card.sizes[0]}">
    <div style="display:flex; justify-content:center; align-items:center; gap:16px; margin-top:6px; margin-bottom:2px;">
      <div style="display:flex; align-items:center; gap:0;">
        <button type="button" onclick="decrementQty(${idx})" style="
          width:22px; height:26px; border:none; background:none; color:#222; font-size:1.1em; cursor:pointer; border-radius:4px 0 0 4px; border:1px solid #ccc; border-right:none; padding:0; font-weight:400;">−</button>
        <span id="qty-val-${idx}" style="
          width:24px; height:26px; display:inline-flex; align-items:center; justify-content:center; border-top:1px solid #ccc; border-bottom:1px solid #ccc; font-size:1em; background:#fafafa; padding:0; font-weight:400;">1</span>
        <button type="button" onclick="incrementQty(${idx})" style="
          width:22px; height:26px; border:none; background:none; color:#222; font-size:1.1em; cursor:pointer; border-radius:0 4px 4px 0; border:1px solid #ccc; border-left:none; padding:0; font-weight:400;">＋</button>
      </div>
      <button onclick="addToCart(${idx})" title="Add to Cart" style="
        background: none; 
        border: none; 
        border-radius: 50%; 
        width: 32px; 
        height: 32px; 
        color: #222; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 1.2em; 
        cursor: pointer;">
        <i class="bi bi-cart" style="font-size:1.4em; color:#222;"></i>
      </button>
    </div>
  </div>
</div>
`;
    });
    window.cards = cards;
  });

    // Store cards globally for addToCart
    // window.cards = cards;
    // After window.cards = cards;
// if (window.location.hash.startsWith('#product-')) {
//     const idx = parseInt(window.location.hash.replace('#product-', ''), 10);
//     if (!isNaN(idx) && window.cards[idx]) {
//         window.showProductModal(idx);
//     }
// }
//   });


// Cart logic
window.addToCart = function(idx) {
    const size = document.getElementById(`size-val-${idx}`).value;
    const qty = document.getElementById(`qty-val-${idx}`).textContent;
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
                <button onclick="removeFromCart(${idx})" title="Remove" style="background:none; border:none; color:#222; font-size:1.1rem; cursor:pointer; margin-left:10px;">
    <i class="fa fa-trash"></i>
</button>
            </div>
        `).join('');
    }
    overlay.style.display = "block";
};

window.closeCart = function() {
    document.getElementById('cart-overlay').style.display = "none";
    var blurBg = document.getElementById('cart-blur-bg');
    if (blurBg) blurBg.style.display = "none";
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
// document.addEventListener('DOMContentLoaded', function() {
//     var closeBtn = document.getElementById('close-detail-card');
//     if (closeBtn) {
//         closeBtn.onclick = function() {
//             document.getElementById('product-detail-card').style.display = 'none';
//             document.getElementById('features-wrapper').style.display = 'block';
//             history.pushState({}, '', window.location.pathname);
//         };
//     }
// });
document.addEventListener('DOMContentLoaded', function() {
    var openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
        openCartBtn.onclick = function() {
            const overlay = document.getElementById('cart-overlay');
            const blurBg = document.getElementById('cart-blur-bg');
            if (overlay.style.display === "block") {
                overlay.style.display = "none";
                if (blurBg) blurBg.style.display = "none";
            } else {
                window.openCart();
                if (blurBg) blurBg.style.display = "block";
            }
        };
    }
});

window.filterCategory = function(category) {
    const featuresRow = document.getElementById('features-row');
    featuresRow.innerHTML = '';
    window.cards
        .filter(card => card.category === category)
        .forEach((card, idx) => {
            featuresRow.innerHTML += `
  <div class="product-card" style="flex: 0 1 160px; min-width: 140px; max-width: 180px; margin: 0 4px 16px 0;">
    <section class="box feature" style="padding: 0.5em;">
      <div class="image featured" style="cursor:pointer; height:120px; overflow:hidden; border-radius:8px;" onclick="showProductModal(${idx})">
        <img src="${card.img}" alt="${card.title}" style="width:100%; height:100%; object-fit:cover; display:block;" />
      </div>
      <div class="inner" style="padding: 0.5em 0;">
        <header>
          <h2 style="font-size:1em; margin:0 0 0.2em 0;">${card.title}</h2>
          <p style="font-size:0.85em; margin:0 0 0.5em 0;">
  ${card.subtitle.length > 10 ? card.subtitle.slice(0, 10) + '...' : card.subtitle}
</p>
        </header>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <label style="font-size:0.9em;">
            <select id="size-${idx}" style="font-size:0.9em;">
              ${card.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
          </label>
          <div style="display:flex; align-items:center; gap:0;">
  <button type="button" onclick="decrementQty(${idx})" style="
    width:22px; height:28px; border:none; background:none; color:#222; font-size:1.2em; cursor:pointer; border-radius:4px 0 0 4px; border:1px solid #ccc; border-right:none; padding:0;">−</button>
  <span id="qty-val-${idx}" style="
    width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-top:1px solid #ccc; border-bottom:1px solid #ccc; font-size:1em; background:#fafafa;">1</span>
  <button type="button" onclick="incrementQty(${idx})" style="
    width:22px; height:28px; border:none; background:none; color:#222; font-size:1.2em; cursor:pointer; border-radius:0 4px 4px 0; border:1px solid #ccc; border-left:none; padding:0;">＋</button>
</div>
          <button onclick="addToCart(${idx})" title="Add to Cart" style="
    background: none; 
    border: none; 
    border-radius: 50%; 
    width: 32px; 
    height: 32px; 
    color: #222; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 1.2em; 
    cursor: pointer;">
  <i class="bi bi-cart" style="font-size:1.4em; color:#222;"></i>
</button>
        </div>
      </div>
    </section>
  </div>
`;
        });
};

// featuresRow.innerHTML += `
//   <div class="col-4 col-12-medium">
//     <section class="box feature">
//       <div class="image featured" style="cursor:pointer;" onclick="showProductModal(${idx})">
//         <img src="${card.img}" alt="${card.title}" />
//       </div>
//       <div class="inner">
//         <header>
//           <h2>${card.title}</h2>
//           <p>${card.subtitle}</p>
//         </header>
//         <p>${card.desc}</p>
//         <!-- ...rest of your code... -->
//       </div>
//     </section>
//   </div>
// `;


document.getElementById('close-detail-card').onclick = function() {
    document.getElementById('product-detail-card').style.display = 'none';
    history.pushState({}, '', window.location.pathname); // Remove hash
};

// document.getElementById('close-modal').onclick = function() {
//     document.getElementById('product-modal').style.display = 'none';
// };

// // Optional: Close modal when clicking outside content
// document.getElementById('product-modal').onclick = function(e) {
//     if (e.target === this) this.style.display = 'none';
// };

window.onpopstate = function(event) {
    const hash = window.location.hash;
    if (hash.startsWith('#product-')) {
        const idx = parseInt(hash.replace('#product-', ''), 10);
        if (!isNaN(idx) && window.cards && window.cards[idx]) {
            window.showProductModal(idx);
        }
    } else {
        document.getElementById('product-detail-card').style.display = 'none';
        document.getElementById('features-wrapper').style.display = 'block';
    }
};


window.showProductModal = function(idx) {
    const card = window.cards[idx];
    document.getElementById('detail-img').src = card.img;
    document.getElementById('detail-title').textContent = card.title;
    document.getElementById('detail-subtitle').textContent = card.subtitle;
    document.getElementById('detail-desc').textContent = card.desc;
    document.getElementById('product-detail-card').style.display = 'block';
    document.getElementById('features-wrapper').style.display = 'none'; // Hide product cards
    document.getElementById('product-detail-card').scrollIntoView({ behavior: 'smooth' });

    // Push state to URL (e.g., #product-2)
    history.pushState({ productIdx: idx }, '', `#product-${idx}`);
};

document.getElementById('close-detail-card').onclick = function() {
    document.getElementById('product-detail-card').style.display = 'none';
    document.getElementById('features-wrapper').style.display = 'block'; // Show product cards
    history.pushState({}, '', window.location.pathname); // Remove hash
};

window.incrementQty = function(idx) {
    const span = document.getElementById(`qty-val-${idx}`);
    let val = parseInt(span.textContent, 10);
    if (val < 10) val++;
    span.textContent = val;
};

window.decrementQty = function(idx) {
    const span = document.getElementById(`qty-val-${idx}`);
    let val = parseInt(span.textContent, 10);
    if (val > 1) val--;
    span.textContent = val;
};

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
        const idx = e.target.getAttribute('data-idx');
        const size = e.target.getAttribute('data-size');
        // Set all buttons in this group to normal weight
        document.querySelectorAll(`#size-group-${idx} .size-btn`).forEach(btn => {
            btn.style.fontWeight = '400';
        });
        // Set selected button to bold
        e.target.style.fontWeight = 'bold';
        // Update hidden input
        document.getElementById(`size-val-${idx}`).value = size;
    }
});

document.querySelectorAll('#nav ul li a').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('#nav ul li').forEach(li => li.classList.remove('current'));
    this.parentElement.classList.add('current');
  });
});