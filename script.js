// ============================================================
//  MENU DATA
// ============================================================
const menuItems = [
  {
    id: 1,
    name: "Classic Pizza",
    desc: "Loaded with cheese, veggies and pepperoni on a crispy crust.",
    price: 299,
    img: "images/pizza.png",
  },
  {
    id: 2,
    name: "Cheese Burger",
    desc: "Juicy double patty with melted cheese & crispy sesame buns.",
    price: 199,
    img: "images/burger.png",
  },
  {
    id: 3,
    name: "Chicken Roll",
    desc: "Fresh flatbread wraps filled with grilled chicken & sauces.",
    price: 179,
    img: "images/chicken-roll.png",
  },
  {
    id: 4,
    name: "Fried Chicken",
    desc: "Crunchy golden drumsticks served hot & spicy with dip.",
    price: 249,
    img: "images/fried-chicken.png",
  },
  {
    id: 5,
    name: "Lasagna",
    desc: "Italian layered pasta with creamy béchamel and rich meat sauce.",
    price: 329,
    img: "images/lasagna.png",
  },
  {
    id: 6,
    name: "Spaghetti",
    desc: "Classic spaghetti tossed in fresh basil tomato sauce.",
    price: 279,
    img: "images/spaghetti.png",
  },
  {
    id: 7,
    name: "Sandwich",
    desc: "Loaded sub roll with grilled chicken, tomato, lettuce & sauce.",
    price: 149,
    img: "images/sandwich.png",
  },
  {
    id: 8,
    name: "Spring Rolls",
    desc: "Crispy rice paper rolls filled with veggies, shrimp & sweet chili.",
    price: 149,
    img: "images/spring-roll.png",
  },
];

// ============================================================
//  CART STATE
// ============================================================
let cart = [];

// ============================================================
//  RENDER MENU
// ============================================================
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = menuItems
    .map(
      (item) => `
    <div class="menu-item">
      <img src="${item.img}" alt="${item.name}" loading="lazy" />
      <div class="menu-item-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-item-footer">
          <span class="price">&#8377;${item.price}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ============================================================
//  CART FUNCTIONS
// ============================================================
function addToCart(id) {
  const item = menuItems.find((m) => m.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  showToast(`${item.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
  renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  updateCartUI();
  renderCartItems();
}

function getSubtotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function getTax() {
  return Math.round(getSubtotal() * 0.05);
}

function getTotal() {
  return getSubtotal() + getTax() + (cart.length > 0 ? 40 : 0);
}

function getTotalQty() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

function updateCartUI() {
  const count = getTotalQty();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("mobileCartCount").textContent = count;
  document.getElementById("summarySubtotal").textContent =
    `\u20B9${getSubtotal()}`;
  document.getElementById("summaryTax").textContent = `\u20B9${getTax()}`;
  document.getElementById("summaryTotal").textContent = `\u20B9${getTotal()}`;
  document.getElementById("cartFooter").style.display = cart.length
    ? "block"
    : "none";
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bowl-food"></i>
        <p>Your cart is empty.<br>Add some delicious items!</p>
      </div>`;
    return;
  }
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="item-price">\u20B9${item.price * item.qty}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">&minus;</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `,
    )
    .join("");
}

// ============================================================
//  CART OPEN / CLOSE
// ============================================================
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================================
//  BILLING MODAL
// ============================================================
function openBilling() {
  if (cart.length === 0) return;

  const itemsHTML =
    cart
      .map(
        (c) => `
    <div class="billing-item">
      <span>${c.name} &times; ${c.qty}</span>
      <span>\u20B9${c.price * c.qty}</span>
    </div>`,
      )
      .join("") +
    `<div class="billing-item"><span>Delivery Fee</span><span>\u20B9 40</span></div>
     <div class="billing-item"><span>Taxes (5%)</span><span>\u20B9${getTax()}</span></div>`;

  document.getElementById("billingItems").innerHTML = itemsHTML;
  document.getElementById("billingTotal").textContent = `\u20B9${getTotal()}`;
  document.getElementById("billingModal").classList.add("open");
  closeCart();
}

function closeBilling() {
  document.getElementById("billingModal").classList.remove("open");
}

function selectPay(el) {
  document
    .querySelectorAll(".pay-method")
    .forEach((m) => m.classList.remove("active"));
  el.classList.add("active");
}

function placeOrder() {
  const name = document.getElementById("billName").value.trim();
  const phone = document.getElementById("billPhone").value.trim();
  const address = document.getElementById("billAddress").value.trim();

  if (!name || !phone || !address) {
    showToast("Please fill in all delivery details!");
    return;
  }

  const total = getTotal();

  document.getElementById("billingBody").innerHTML = `
    <div class="order-success">
      <i class="fa-solid fa-circle-check"></i>
      <h3>Order Placed! &#127881;</h3>
      <p>Thank you, <strong>${name}</strong>!<br>
         Your order is confirmed and will be delivered to
         <strong>${address}</strong> in 30&ndash;45 minutes.</p>
      <p style="color:var(--primary);font-weight:700;font-size:1.1rem">
        Order Total: \u20B9${total}
      </p>
      <button class="btn" style="margin-top:1.5rem"
        onclick="closeBilling(); resetCart();">
        <i class="fa-solid fa-house"></i> Back to Home
      </button>
    </div>`;
}

function resetCart() {
  cart = [];
  updateCartUI();
}

// ============================================================
//  MOBILE MENU
// ============================================================
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const icon = document.getElementById("menuIcon");
  menu.classList.toggle("open");
  icon.className = menu.classList.contains("open")
    ? "fa-solid fa-xmark"
    : "fa-solid fa-bars";
}

function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("open");
  document.getElementById("menuIcon").className = "fa-solid fa-bars";
}

// ============================================================
//  TOAST NOTIFICATIONS
// ============================================================
function showToast(msg) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
//  INIT
// ============================================================
renderMenu();
