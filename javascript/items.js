fetch('javascript/app-config.json')
  .then(response => response.json())
  .then(config => {
fetch('javascript/products_1.json')
  .then(response => response.json())
  .then(cards => {
    const featuresRow = document.getElementById('features-row');
    featuresRow.innerHTML = '';
    cards.forEach(card => {
      card.img = `${config.baseImageUrl}${card.category}/${card.product_id}.webp`;
      console.log(`Loaded image for ${card.title}: ${card.img}`);
    });
    cards.forEach((card, idx) => {
      featuresRow.innerHTML += `
 <div class="product-card" style="margin: 0 1.5px 16px 0;">
  <section class="box feature" style="padding: 0.2em;">
    <div class="image-featured" style="cursor:pointer;  overflow:hidden;" onclick="showProductModal('${card.productId}')">
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
  <div class="card-title-wrap">
    <h2 class="product-card-title">
  ${card.title.length > 22 ? card.title.slice(0, 22) + '...' : card.title}
</h2>
</header>
<p style="font-size:0.90em; margin:0; padding:0;">
  ${card.subtitle.length > 25 ? card.subtitle.slice(0, 25) + '...' : card.subtitle}
</p>
    <input type="hidden" id="size-val-${idx}" value="${card.sizes[0]}">
    <div class="qty-row" style="display:flex; justify-content:center; align-items:center; gap:16px;">
      <div style="display:flex; align-items:center; gap:0;">
        <button type="button" onclick="decrementQty(${idx})" class="qty-btn qty-btn-minus">−</button>
        <span id="qty-val-${idx}" style="
          width:24px; height:26px; display:inline-flex; align-items:center; justify-content:center; border-top:1px solid #ccc; border-bottom:1px solid #ccc; font-size:1em; background:#fafafa; padding:0; font-weight:400;">1</span>
        <button type="button" onclick="incrementQty(${idx})" class="qty-btn qty-btn-plus">＋</button>
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
    console.log(cards[idx].img);
    const item = {
        title: cards[idx].title,
        size,
        qty,
        img: cards[idx].img, // Use the image from the card
        productId: cards[idx].productId // Store product ID for reference
    };
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.qty} x ${item.title} (${item.size}) added to cart!`);
    updateCartTooltip();
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
        <div style="display:flex; align-items:center; gap:10px;">
            <img src="${item.img}" alt="${item.title}" style="width:38px; height:38px; object-fit:contain; border-radius:4px; background:#fafafa; border:1px solid #eee;">
            <span style="font-size:1rem;">${item.qty} x ${item.title} (${item.size})</span>
        </div>
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
    updateCartTooltip();
};

// window.submitCart = function() {
//     let cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     if(cart.length === 0) {
//         alert("Cart is empty!");
//         return;
//     }

//     // Prepare orders array for EmailJS template
//     const orders = cart.map(item => {
//     // Find the card object for this item
//     const card = window.cards.find(c => c.title === item.title);
//     return {
//         name: item.title + ' (' + item.size + ')',
//         units: item.qty,
//         img: card ? card.img : '' // Add image URL
//     };
// });

//     // Generate a random order ID (or use a better method if you have one)
//     const order_id = Date.now();

//     // Example cost object (replace with your actual calculation)
    

//     // Get customer email (you may want to collect this from a form)
//     const email = prompt("Enter your email for order confirmation:");

//     const templateParams = {
//         email: email,
//         order_id: order_id,
//         orders: orders
//     };

//     emailjs.send('service_j4ldpce', 'template_z6m80gm', templateParams)
//         .then(function(response) {
//             alert('Cart submitted! We will contact you soon.');
//             localStorage.removeItem('cart');
//             closeCart();
//         }, function(error) {
//             alert('Failed to submit cart. Please try again.');
//         });
// };


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

    document.getElementById('cart-details-form').onsubmit = function(e) {
        e.preventDefault();
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if(cart.length === 0) {
            alert("Cart is empty!");
            return;
        }
        const form = e.target;
        const orders = cart.map(item => {
            const card = window.cards.find(c => c.title === item.title);
            return {
                name: item.title,
                size: item.size,
                units: item.qty,
                img: card ? card.img : ''
            };
        });
        const order_id = Date.now();
        const templateParams = {
            name: form.name.value,
            email: form.email.value,
            country: form.country.value,
            phone: form.phone.value,
            whatsapp: form.whatsapp.value,
            order_id: order_id,
            orders: orders
        };

        // emailjs.send('service_j4ldpce', 'template_z6m80gm', templateParams)
        emailjs.send('service_z6haeg9', 'template_48q6tae', templateParams)
            .then(function(response) {
                document.getElementById('success-modal').style.display = 'flex';
                localStorage.removeItem('cart');
                document.getElementById('cart-form-modal').style.display = 'none';
                form.reset();
                closeCart();
                updateCartTooltip();
            }, function(error) {
                alert('Failed to submit cart. Please try again.');
            });
    };

    document.getElementById('close-cart-form').onclick = function() {
        document.getElementById('cart-form-modal').style.display = 'none';
    };

    document.getElementById('cart-form-modal').onclick = function(e) {
        if (e.target === this) this.style.display = 'none';
    };
    var closeSuccessBtn = document.getElementById('close-success-modal');
    if (closeSuccessBtn) {
        closeSuccessBtn.onclick = function() {
            document.getElementById('success-modal').style.display = 'none';
        };
    }
    updateCartTooltip();
});
window.submitCart = function() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    // Show the modal form
    document.getElementById('cart-form-modal').style.display = 'flex';
    updateCartTooltip();
};

// Show success modal
document.getElementById('success-modal').style.display = 'flex';

// Optional: Hide the cart form/modal if open
document.getElementById('cart-form-modal').style.display = 'none';

// Close modal on click of X
document.getElementById('close-success-modal').onclick = function() {
  document.getElementById('success-modal').style.display = 'none';
};


// document.getElementById('cart-details-form').onsubmit = function(e) {
//     e.preventDefault();
//     let cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     if(cart.length === 0) {
//         alert("Cart is empty!");
//         return;
//     }
//     const form = e.target;
//     const orders = cart.map(item => {
//         const card = window.cards.find(c => c.title === item.title);
//         return {
//             name: item.title + ' (' + item.size + ')',
//             units: item.qty,
//             img: card ? card.img : ''
//         };
//     });
//     const order_id = Date.now();
//     const templateParams = {
//         name: form.name.value,
//         email: form.email.value,
//         phone: form.phone.value,
//         whatsapp: form.whatsapp.value,
//         order_id: order_id,
//         orders: orders.map(o => `${o.units} x ${o.name}`).join('\n')
//     };

//     emailjs.send('service_j4ldpce', 'template_z6m80gm', templateParams)
//         .then(function(response) {
//             alert('Cart submitted! We will contact you soon.');
//             localStorage.removeItem('cart');
//             document.getElementById('cart-form-modal').style.display = 'none';
//             form.reset();
//             closeCart();
//         }, function(error) {
//             alert('Failed to submit cart. Please try again.');
//         });
// };
function selectCategory(btn, category) {
  // Remove 'current' from all nav items
  document.querySelectorAll('#nav .nav-list li').forEach(li => li.classList.remove('current'));
  // Add 'current' to the clicked button's parent <li>
  btn.parentElement.classList.add('current');
  // Call your filter function
  filterCategory(category);
}


window.toggleDropdown = function(btn) {
  console.log('Toggling dropdown for window:', btn);
  const li = btn.parentElement;
  const dropdown = li.querySelector('.dropdown-menu');
  const wasOpen = li.classList.contains('open');
  // Close all other dropdowns
  document.querySelectorAll('#nav .more-dropdown.open').forEach(el => {
    el.classList.remove('open');
    const menu = el.querySelector('.dropdown-menu');
    if (menu) menu.style.display = ''; // Remove any inline style
  });
  // Toggle this one
  if (!wasOpen) {
    li.classList.add('open');
    if (dropdown) dropdown.style.display = ''; // Remove any inline style
    // Use setTimeout to avoid immediate close from the same click
    setTimeout(() => {
      function handler(e) {
        if (!li.contains(e.target)) {
          li.classList.remove('open');
          if (dropdown) dropdown.style.display = '';
          document.removeEventListener('click', handler);
        }
      }
      document.addEventListener('click', handler);
    }, 0);
  }
};

function filterCategory (category) {
    const featuresRow = document.getElementById('features-row');
    featuresRow.innerHTML = '';
    window.cards
        .filter(card => card.category === category)
        .forEach((card, idx) => {
            featuresRow.innerHTML += `
  <div class="product-card" style="margin: 0 1.5px 16px 0;">
  <section class="box feature" style="padding: 0.2em;">
    <div class="image-featured" style="cursor:pointer;  overflow:hidden;" onclick="showProductModal('${card.productId}')">
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
  <div class="card-title-wrap">
    <h2 class="product-card-title">
  ${card.title.length > 22 ? card.title.slice(0, 22) + '...' : card.title}
</h2>
</header>
<p style="font-size:0.90em; margin:0; padding:0;">
  ${card.subtitle.length > 25 ? card.subtitle.slice(0, 25) + '...' : card.subtitle}
</p>
    <input type="hidden" id="size-val-${idx}" value="${card.sizes[0]}">
    <div class="qty-row" style="display:flex; justify-content:center; align-items:center; gap:16px;">
      <div style="display:flex; align-items:center; gap:0;">
        <button type="button" onclick="decrementQty(${idx})" class="qty-btn qty-btn-minus">−</button>
        <span id="qty-val-${idx}" style="
          width:24px; height:26px; display:inline-flex; align-items:center; justify-content:center; border-top:1px solid #ccc; border-bottom:1px solid #ccc; font-size:1em; background:#fafafa; padding:0; font-weight:400;">1</span>
        <button type="button" onclick="incrementQty(${idx})" class="qty-btn qty-btn-plus">＋</button>
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
        const productId = hash.replace('#product-', '');
        window.showProductModal(productId); // Pass productId directly
    } else {
        document.getElementById('product-detail-card').style.display = 'none';
        document.getElementById('features-wrapper').style.display = 'block';
    }
};


window.showProductModal = function(productId) {
    const card = window.cards.find(c => c.productId === productId);
    if (!card) return; // Handle case where productId is invalid

    document.getElementById('detail-img').src = card.img;
    document.getElementById('detail-title').textContent = card.title;
    document.getElementById('detail-subtitle').textContent = card.subtitle;
    document.getElementById('detail-desc').textContent = card.desc;
    document.getElementById('product-detail-card').style.display = 'block';
    document.getElementById('features-wrapper').style.display = 'none'; // Hide product cards
    document.getElementById('product-detail-card').scrollIntoView({ behavior: 'smooth' });

    // Push state to URL using productId
    history.pushState({ productId: card.productId }, '', `#product-${card.productId}`);
};

document.getElementById('close-detail-card').onclick = function() {
    document.getElementById('product-detail-card').style.display = 'none';
    document.getElementById('features-wrapper').style.display = 'block'; // Show product cards
    history.pushState({}, '', window.location.pathname); // Remove hash
};

function incrementQty(idx) {
    const span = document.getElementById(`qty-val-${idx}`);
    let val = parseInt(span.textContent, 10);
    if (val < 10) val++;
    span.textContent = val;
};

function decrementQty (idx) {
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

function submitCart() {
  document.getElementById('cart-form-modal').style.display = 'flex';
}

function updateCartTooltip() {
  const cartBtn = document.getElementById('open-cart-btn');
  const badge = document.getElementById('cart-count-badge');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cartBtn) {
    if (cart.length === 0) {
      cartBtn.title = "Cart is empty";
    } else if (cart.length === 1) {
      cartBtn.title = "1 item in cart";
    } else {
      cartBtn.title = cart.length + " items in cart";
    }
  }
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length ? "inline-block" : "none";
  }
}