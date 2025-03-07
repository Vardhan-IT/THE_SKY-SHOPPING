var cart = [];
var currentUser = null;

// Define products
const products = {
  electronics: [
    { name: "Laptop", price: 800 },
    { name: "Smart TV", price: 600 },
    { name: "Headphones", price: 150 },
  ],
  clothes: [
    { name: "T-Shirt", price: 20 },
    { name: "Jeans", price: 40 },
  ],
  shoes: [
    { name: "Sneakers", price: 60 },
    { name: "Sandals", price: 30 },
  ],
  smartphones: [
    { name: "Smartphone A", price: 500 },
    { name: "Smartphone B", price: 650 },
    { name: "Smartphone C", price: 700 },
  ],
};

// Function to add product to cart
function addToCart(productName, price, quantity) {
  if (!currentUser) {
    alert("Please sign in to add items to the cart.");
    return;
  }

  quantity = parseInt(quantity);
  const existingProductIndex = cart.findIndex((item) => item.name === productName);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  updateCartInfo();
  alert(`${productName} has been added to your cart.`);
}

// Function to update cart information
function updateCartInfo() {
  const cartInfo = document.getElementById("cart-info");
  const cartItems = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartInfo.innerText = `Cart: ${cart.length} item(s)`;
  cartItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="decreaseQuantity(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;
    cartItems.appendChild(cartItemDiv);
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Functions to open and close the side menu
function openMenu() {
  document.getElementById("side-menu").style.width = "250px";
}

function closeMenu() {
  document.getElementById("side-menu").style.width = "0";
}

// Account Operations
function signUp(username, password) {
  if (localStorage.getItem(username)) {
    alert("Username already exists. Please choose a different one.");
  } else {
    const userData = { password: password, cart: [] };
    localStorage.setItem(username, JSON.stringify(userData));
    alert("Account created successfully.");
  }
}

function logIn(username, password) {
  const storedUserData = JSON.parse(localStorage.getItem(username));
  if (!storedUserData) {
    alert("No account found with this username.");
  } else if (storedUserData.password === password) {
    currentUser = username;
    alert(`Welcome, ${username}`);
    document.getElementById("account-info").innerText = `Hello, ${username}`;
    document.getElementById("logout-button").style.display = "inline";
    loadCart();
  } else {
    alert("Incorrect password.");
  }
}

function logOut() {
  currentUser = null;
  cart = [];
  document.getElementById("account-info").innerText = "Hello, Guest";
  document.getElementById("logout-button").style.display = "none";
  alert("You have been logged out.");
  updateCartInfo();
}

function deleteAccount() {
  if (!currentUser) {
    alert("No user is logged in.");
    return;
  }

  if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
    localStorage.removeItem(currentUser);
    logOut();
    alert("Account deleted successfully.");
  }
}

// Functions to save and load the cart
function saveCart() {
  if (currentUser) {
    const storedUserData = JSON.parse(localStorage.getItem(currentUser));
    storedUserData.cart = cart;
    localStorage.setItem(currentUser, JSON.stringify(storedUserData));
  }
}

function loadCart() {
  if (currentUser) {
    const storedUserData = JSON.parse(localStorage.getItem(currentUser));
    cart = storedUserData.cart || [];
    updateCartInfo();
  }
}

// Function to toggle login/signup popup
function toggleLoginPopup() {
  const action = prompt('Type "login" to log in, "signup" to sign up, or "delete" to delete your account:');
  const username = prompt("Enter your username:");
  const password = prompt("Enter your password:");

  if (action === "login") {
    logIn(username, password);
  } else if (action === "signup") {
    signUp(username, password);
  } else if (action === "delete") {
    deleteAccount();
  }
}

// Functions to increase, decrease and remove items in the cart
function increaseQuantity(index) {
  cart[index].quantity++;
  updateCartInfo();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    updateCartInfo();
  } else {
    removeItem(index);
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartInfo();
}

// Functions to show and hide the cart and products
function showCart() {
  document.getElementById("cart-container").style.display = "block";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("ad-container").style.display = "none";
}

function hideCart() {
  document.getElementById("cart-container").style.display = "none";
  showProducts();
}

function showHome() {
  document.getElementById("ad-container").style.display = "flex";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("cart-container").style.display = "none";
}

function showProducts(category) {
  document.getElementById("ad-container").style.display = "none";
  document.getElementById("product-container").style.display = "flex";
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Clear existing products

  const selectedProducts = category
    ? products[category]
    : [].concat(...Object.values(products));
  
  selectedProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <input type="number" min="1" value="1" id="quantity-${product.name.replace(/\s+/g, '-')}" />
            <button onclick="addToCart('${product.name}', ${product.price}, document.getElementById('quantity-${product.name.replace(/\s+/g, '-')}).value)">Add to Cart</button>
        `;
    productContainer.appendChild(productDiv);
  });
}

// Function to search products
function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  const productElements = document.querySelectorAll(".product");

  productElements.forEach((product) => {
    const productName = product.querySelector("h3").innerText.toLowerCase();
    product.style.display = productName.includes(query) ? "block" : "none";
  });
}

// Function to show and hide payment methods
function showPaymentMethods() {
  const paymentMethods = document.getElementById("payment-methods");
  paymentMethods.style.display = paymentMethods.style.display === "block" ? "none" : "block";
}

// Functions to show About Us and Contact Us sections
function showAboutUs() {
  document.getElementById("about-us").style.display = "flex";
  document.getElementById("contact-us").style.display = "none";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("cart-container").style.display = "none";
  showHome();
}

function showContactUs() {
  document.getElementById("contact-us").style.display = "flex";
  document.getElementById("about-us").style.display = "none";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("cart-container").style.display = "none";
  showHome();
}

// Initially show the home section on page load
document.addEventListener("DOMContentLoaded", () => {
  showHome();
});

// Function to add product to cart
function addToCart(productName, price, quantity) {
    if (!currentUser) {
        alert("Please sign in to add items to the cart.");
        return;
    }

    quantity = parseInt(quantity);
    if (quantity <= 0 || isNaN(quantity)) {
        alert("Please enter a valid quantity.");
        return;
    }

    const existingProductIndex = cart.findIndex((item) => item.name === productName);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity; // Increase quantity if item exists
    } else {
        cart.push({ name: productName, price: price, quantity: quantity }); // Add new item
    }

    updateCartInfo(); // Update UI
    saveCart(); // Save to localStorage
    alert(`${productName} (${quantity}) added to cart.`);
}

// Function to update cart details
function updateCartInfo() {
    const cartInfo = document.getElementById("cart-info");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    let totalQuantity = 0;
    let totalPrice = 0;
    cartItems.innerHTML = ""; // Clear previous cart items

    cart.forEach((item, index) => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="decreaseQuantity(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    cartInfo.innerText = `Cart: ${totalQuantity} item(s)`;
    totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to show the cart when "View Cart" is clicked
function showCart() {
    document.getElementById("cart-container").style.display = "block";
    document.getElementById("product-container").style.display = "none";
    document.getElementById("ad-container").style.display = "none";
    updateCartInfo(); // Ensure the cart is updated before displaying
}
