const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');

const walletContainer = document.querySelector('.wallet-container');
const walletText = document.querySelector('.wallet-text');
const walletAdd = document.querySelector('#wallet-add');
const walletSubtract = document.querySelector('#wallet-subtract')
let walletAmount = document.querySelector('.wallet-amount');

let wallet = 1000;

let items = [
    {
        id: 1,
        name: 'Nothing Phone 1',
        price: 400,
    },
    {
        id: 2,
        name: 'Nothing Phone 2',
        price: 800,
    },
    {
        id: 3,
        name: 'Nothing Phone 2a',
        price: 380,
    },
    {
        id: 4,
        name: 'Nothing Ear1',
        price: 50,
    },
    {
        id: 5,
        name: 'Nothing Ear2',
        price: 150,
    }
];

let cart = [];
let cartPrice = 0; 

function sortItems(sortOption) {
    if (sortOption === "lowest-to-highest") {
        items.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highest-to-lowest") {
        items.sort((a, b) => b.price - a.price);
    }
}

function fillItemsGrid() {
    itemsGrid.innerHTML = '';
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="./images/${item.id}.jpg" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }
}

function openModal() {
  modal.classList.toggle('show-modal');
  displayCart();
}

function closeModal() {
    modal.classList.toggle('show-modal');
  }

function resetCart() {
    cart = [];
    cartPrice = 0;
    cartBadge.textContent = cart.length;
    closeModal();
}

function updateWallet() {
    walletAmount.textContent = wallet;
    console.log("Wallet updated.")
}

function displayCart() {
    cartItemsList.innerHTML = '';
    const itemQuantities = new Map();
    cart.forEach(item => {
        const itemId = item.id;
        if (itemQuantities.has(itemId)) {
            itemQuantities.set(itemId, itemQuantities.get(itemId) + 1);
        } else {
            itemQuantities.set(itemId, 1);
        }
    });

    itemQuantities.forEach((quantity, itemId) => {
        const item = items.find(item => item.id == itemId);
        if (item) {
            const li = document.createElement('li');
            li.textContent = `${item.name} - Quantity: ${quantity} - $${(item.price * quantity)}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeItemFromCart(itemId);
            });
            li.appendChild(removeButton);
            cartItemsList.appendChild(li);
        }
    });
    cartTotal.textContent = `$${cartPrice}`;
}

function removeItemFromCart(itemId) {
    const index = cart.findIndex(item => item.id == itemId);
    if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        cartPrice -= removedItem.price;
        cartBadge.textContent=cart.length;
        displayCart();
    }
}

function buyItems() {
    if(wallet >= cartPrice && cartPrice > 0){
        alert(`Items purchased for $${cartPrice}. Enjoy!`);
        wallet-=cartPrice;
        updateWallet();
        resetCart();
    }
    else if(cartPrice <= 0){
        alert("Your cart is empty.");
    }
    else{
        alert("The total price of the cart is larger than the amount you have in your wallet. Please remove some items.");
    }
}

function addToWallet() {
    wallet+=50;
    updateWallet();
}

function subtractFromWallet() {
    wallet-=50;
    if(wallet < 0){
        wallet = 0;
        alert("Wallet amount cannot go below 0.");
    }
    updateWallet();
}

cartButton.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
buyButton.addEventListener('click', buyItems);
walletAdd.addEventListener('click', addToWallet);
walletSubtract.addEventListener('click', subtractFromWallet);

function addToCart(id) {
    const selectedItem = items.find((item) => item.id == id);
    console.log(selectedItem)
    if (selectedItem) {
      cart.push(selectedItem);
      cartBadge.textContent = cart.length;
      cartPrice += selectedItem.price;
    } else {
      console.error("Error 404: Item not found.");
    }
  }

function enableButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function (event) {
            const selectedItemID = event.target.dataset.id;
            console.log(selectedItemID)
            addToCart(selectedItemID);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-select');

    const defaultSortOption = "lowest-to-highest";
    sortItems(defaultSortOption);

    fillItemsGrid();
    updateWallet();
    enableButtons();
    
    sortSelect.addEventListener('change', function() {
        const sortOption = this.value;
        sortItems(sortOption);
        fillItemsGrid();
        enableButtons();
    });
});

