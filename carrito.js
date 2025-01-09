class Carrito {
    constructor() {
        // Cargar carrito desde localStorage o inicializar vacío
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
        this.actualizarCarrito();
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        this.items.push(producto);
        this.totalPrice += producto.price;
        this.guardarCarrito();
        this.actualizarCarrito();
    }

    // Eliminar producto del carrito por índice
    eliminarProducto(index) {
        this.totalPrice -= this.items[index].price;
        this.items.splice(index, 1);
        this.guardarCarrito();
        this.actualizarCarrito();
    }

    // Actualizar el carrito en la interfaz
    actualizarCarrito() {
        const cartItems = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');

        // Vaciar la lista de productos
        cartItems.innerHTML = '';

        // Crear la lista con productos
        this.items.forEach((item, index) => {
            const listItem = document.createElement('li');

            // Crear el contenido del producto con el botón "Eliminar"
            const itemText = document.createElement('span');
            itemText.innerText = `${item.name} - $${item.price.toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.innerText = 'Eliminar';
            removeButton.className = 'button-eliminar';
            removeButton.onclick = () => this.eliminarProducto(index);

            // Agregar el contenido al elemento de la lista
            listItem.appendChild(itemText);
            listItem.appendChild(removeButton);

            // Agregar el elemento de la lista al carrito
            cartItems.appendChild(listItem);
        });

        // Actualizar el precio total
        totalPriceElement.innerText = `$${this.totalPrice.toFixed(2)}`;
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    // Generar ticket (si es necesario)
    generarTicket() {
        if (this.items.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de pagar.');
            return;
        }

        let ticket = 'Ticket de compra:\n\n';
        this.items.forEach(item => {
            ticket += `Producto: ${item.name} - Precio: $${item.price.toFixed(2)}\n`;
        });
        ticket += `\nTotal: $${this.totalPrice.toFixed(2)}`;
        alert(ticket);

        // Vaciar el carrito después del pago
        this.items = [];
        this.totalPrice = 0;
        this.guardarCarrito();
        this.actualizarCarrito();
    }
}

// Inicializar el carrito
const carrito = new Carrito();

// Botón "Regresar" para redirigir
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'Productos.html'; // Cambiar según tu archivo
});

function agregarAlCarrito(product, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.product === product);
    if (existingProductIndex === -1) {
        // Agregar nuevo producto
        cart.push({ product, price });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto agregado al carrito.');
    } else {
        alert('El producto ya está en el carrito.');
    }
}