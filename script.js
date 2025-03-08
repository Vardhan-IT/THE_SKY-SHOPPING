var cart = [];
var currentUser = null;

const products = {
  christmas_items: [
    { name: "christmas cap", price: 800 },
    { name: "bells", price: 600 },
    { name: " snow gloves", price: 150 }
  ],
  western_wear_clothes: [
    { name: "T-Shirt", price: 20 },
    { name: "Jeans", price: 40 }
  ],
  traditional_clothes: [
    { name: "kurta pajama", price: 60 },
    { name: "chudidar", price: 30 }
  ],
  diwali_items: [
    { name: "crackers-rockets", price: 500 },
    { name: "depalu", price: 650 },
    { name: "crackers-matches", price: 700 }
  ]
};
function addToCart(productName, price, quantity) {
  if (!currentUser) {
    alert("Please sign in to add items to the cart.");
    return;
  }

  quantity = parseInt(quantity);
  if (isNaN(quantity) || quantity < 1) {
    alert("Please enter a valid quantity (at least 1).");
    return;
  }

  const existingProductIndex = cart.findIndex(
    (item) => item.name === productName
  );

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  updateCartInfo();
  alert(
    `${productName} has been added to your cart with quantity ${quantity}.`
  );
}

function updateCartInfo() {
  const cartInfo = document.getElementById("cart-info");
  const cartItems = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  let totalItems = 0;
  let totalPrice = 0;

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span class="cart-item-price">$${(
              item.price * item.quantity
            ).toFixed(2)}</span>
            <div>
              <button onclick="increaseQuantity(${index})">+</button>
              <button onclick="decreaseQuantity(${index})">-</button>
              <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    cartItems.appendChild(cartItemDiv);
  });

  cartInfo.innerText = `Cart: ${totalItems} item(s)`;
  totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;

  saveCart();
}

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
    loadCart(); // Load cart from local storage
  } else {
    alert("Incorrect password.");
  }
}

function logOut() {
  currentUser = null;
  cart = []; // Clear the cart on logout
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

  if (
    confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    )
  ) {
    localStorage.removeItem(currentUser);
    logOut();
    alert("Account deleted successfully.");
  }
}

function saveCart() {
  if (currentUser) {
    const storedUserData = JSON.parse(localStorage.getItem(currentUser));
    storedUserData.cart = cart; // Save the current cart
    localStorage.setItem(currentUser, JSON.stringify(storedUserData));
  }
}

function loadCart() {
  if (currentUser) {
    const storedUserData = JSON.parse(localStorage.getItem(currentUser));
    cart = storedUserData.cart || []; // Load the cart from local storage
    updateCartInfo();
  }
}

function toggleLoginPopup() {
  const action = prompt(
    'Type "login" to log in, "signup" to sign up, or "delete" to delete your account:'
  );
  if (!action) return;
  const username = prompt("Enter your username:");
  if (!username) return;
  const password = prompt("Enter your password:");
  if (!password) return;

  if (action.toLowerCase() === "login") {
    logIn(username, password);
  } else if (action.toLowerCase() === "signup") {
    signUp(username, password);
  } else if (action.toLowerCase() === "delete") {
    deleteAccount();
  } else {
    alert("Invalid action.");
  }
}

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

function showCart() {
  if (!currentUser) {
    alert("Please sign in to view your cart.");
    return;
  }
  document.getElementById("cart-container").style.display = "block";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("ad-container").style.display = "none";
  document.getElementById("about-us").style.display = "none";
  document.getElementById("contact-us").style.display = "none";
}

function hideCart() {
  document.getElementById("cart-container").style.display = "none";
  showProducts();
}

function showHome() {
  document.getElementById("ad-container").style.display = "flex";
  document.getElementById("product-container").style.display = "none";
  document.getElementById("cart-container").style.display = "none";
  document.getElementById("about-us").style.display = "none";
  document.getElementById("contact-us").style.display = "none";
}

function showProducts(category) {
  document.getElementById("ad-container").style.display = "none";
  document.getElementById("product-container").style.display = "flex";
  document.getElementById("cart-container").style.display = "none";
  document.getElementById("about-us").style.display = "none";
  document.getElementById("contact-us").style.display = "none";

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
            <label for="quantity-${product.name}">Quantity:</label>
            <input type="number" id="quantity-${product.name}" value="1" min="1" style="width: 60px;">
            <button onclick="addToCart('${product.name}', ${product.price}, document.getElementById('quantity-${product.name}').value)">Add to Cart</button>
        `;
    productContainer.appendChild(productDiv);
  });
}

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  const productElements = document.querySelectorAll(".product");

  productElements.forEach((element) => {
    const productName = element.querySelector("h3").innerText.toLowerCase();
    if (productName.includes(query)) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}
