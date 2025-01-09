const cart = {
  items: [],

  init() {
    this.render();
    this.setupEventListeners();
    this.setupStyles();
    this.hideCatalogButtons();
  },

  setupStyles() {
    const styles = `
      /* Estilo del contenedor del carrito, fijo en la pantalla */
      .cart-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
      }

      .cart-button {
        background: #2563eb !important;
        color: white;
        border: none !important;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      }

      .cart-button:hover {
        transform: scale(1.1);
      }

      .cart-count {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #dc2626;
        color: white;
        border-radius: 50%;
        padding: 6px 8px;
        font-size: 14px;
        font-weight: bold;
        min-width: 20px;
        height: 20px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
      }

      .cart-modal {
        background: white;
        border-radius: 10px 0 0 10px;
        padding: 20px;
        overflow-y: auto;
        position: fixed;
        top: 0;
        right: 0;
        width: 350px;
        height: 100vh;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        z-index: 999;
        display: none; /* Modal hidden by default */
      }

    .close-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 30px;  /* Aumenta el tamaño de la fuente para que se vea claramente */
  color: #1e293b;  /* Color visible para la 'X' */
  font-weight: bold;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;  /* Asegura que el botón esté encima de otros elementos */
}

      .cart-item {
        background: #f8fafc;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
      }

      .cart-item-name {
        font-weight: 600;
        color: #1e293b;
      }

      .cart-item-price {
        color: #64748b;
      }

      .quantity-btn {
        background: #e2e8f0;
        border: none;
        border-radius: 4px;
        padding: 6px 10px;
        cursor: pointer;
        color: #1e293b;
        transition: background 0.2s;
        font-size: 16px;
      }

      .quantity-btn:hover {
        background: #cbd5e1;
      }

      .quantity-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .quantity-text {
        font-size: 16px;
        color: #1e293b;
      }

      .cart-item-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .delete-btn {
        background: #fee2e2;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        width: 60px;
        cursor: pointer;
        color: #dc2626;
        transition: background 0.2s;
        font-size: 16px;
      }

      .delete-btn:hover {
        background: #fecaca;
      }

      .checkout-btn {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 12px;
        width: 100%;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      .checkout-btn:hover {
        background: #1d4ed8;
      }

      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .catalog-button {
        display: block;
      }

      .catalog-button.cart-open {
        display: none;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  },

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  },

  addItem(name, price) {
    const existingItem = this.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
      this.showNotification(`Se agregó otra unidad de ${name} al carrito`);
    } else {
      this.items.push({ name, price, quantity: 1 });
      this.showNotification(`${name} agregado al carrito`);
    }
    this.render();
  },

  removeItem(name) {
    this.items = this.items.filter(item => item.name !== name);
    this.showNotification(`${name} eliminado del carrito`);
    this.render();
  },

  updateQuantity(name, delta) {
    const item = this.items.find(item => item.name === name);
    if (item) {
      item.quantity = Math.max(0, item.quantity + delta);
      if (item.quantity === 0) {
        this.removeItem(name);
      } else {
        this.render();
      }
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  setupEventListeners() {
    // Agregar listener para los botones de productos
    document.querySelectorAll('.button-producto').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        this.addItem(name, price);
      });
    });
  
    // Asegurarse de que el botón de cierre esté disponible
    const closeButton = document.querySelector('.close-btn');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.toggleCart();  // Llamar al método toggleCart cuando se haga clic en "X"
      });
    }
  },

  render() {
    const cartRoot = document.getElementById('cart-root');
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    cartRoot.innerHTML = `
      <div class="cart-container">
        <button onclick="cart.toggleCart()" class="cart-button">
          <i class="fas fa-shopping-cart"></i>
        </button>
        ${itemCount > 0 ? `<span class="cart-count">${itemCount}</span>` : ''}
      </div>

      <div id="cart-modal" class="cart-modal" style="display: none;">
        <button class="close-btn">X</button>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #1e293b;">Carrito de Compras</h3>
        </div>
        
        ${this.items.length === 0 ? 
          '<p style="text-align: center; color: #64748b;">El carrito está vacío</p>' : 
          `<div style="max-height: calc(100vh - 200px); overflow-y: auto;">
            ${this.items.map(item => `
              <div class="cart-item">
                <div style="margin-bottom: 8px;">
                  <span class="cart-item-name">${item.name}</span>
                  <span class="cart-item-price">$${item.price}</span>
                </div>
                <div class="cart-item-controls">
                  <div class="quantity-container">
                    <button onclick="cart.updateQuantity('${item.name}', -1)" class="quantity-btn">-</button>
                    <span class="quantity-text">${item.quantity}</span>
                    <button onclick="cart.updateQuantity('${item.name}', 1)" class="quantity-btn">+</button>
                  </div>
                  <button onclick="cart.removeItem('${item.name}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; font-weight: 600; color: #1e293b; margin-bottom: 16px;">
              <span>Total:</span>
              <span>$${this.getTotal()}</span>
            </div>
            <button onclick="cart.checkout()" class="checkout-btn">
              Finalizar Compra
            </button>
          </div>` 
        }
      </div>
    `;
  },

  toggleCart() {
    const modal = document.getElementById('cart-modal');
    const cartContainer = document.querySelector('.cart-container');
    const cartCount = document.querySelector('.cart-count');
  
    if (modal.style.display === 'none') {
        modal.style.display = 'block';  // Muestra el modal
        cartContainer.style.display = 'none';
        if (cartCount) {
            cartCount.style.display = 'none';
        }
    } else {
        modal.style.display = 'none';  // Oculta el modal
        cartContainer.style.display = 'block';
        if (cartCount) {
            cartCount.style.display = 'block';
        }
    }
  },

  checkout() {
    if (this.items.length === 0) {
      this.showNotification('El carrito está vacío');
      return;
    }
    alert('¡Gracias por tu compra!');
    this.items = [];
    this.render();
    this.toggleCart();
  },

  hideCatalogButtons() {
    document.querySelectorAll('.catalog-button').forEach(button => {
      button.style.display = 'block';
    });
  }
};

cart.init();
