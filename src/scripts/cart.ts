const domain = import.meta.env.WP_DOMAIN

const CART_URL  = `${domain}/wp-json/wc/store/v1/cart`

export async function fetchCart() {
    try {
      const response = await fetch(CART_URL);
      if (!response.ok) throw new Error('Error cargando carrito');
      const cart = await response.json();
  
      updateCartCount(cart.items_count);
      renderCartItems(cart.items);
      updateCartTotals(cart.totals);
  
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    }
  }
  
  // ✅ Actualiza la burbuja con el número de productos
  function updateCartCount(count: number) {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = String(count || 0);
  }
  
  // ✅ Renderizar cada ítem como tarjeta en el sidebar
  function renderCartItems(items: any[]) {
    const container = document.getElementById('cartItems');
    if (!container) return;
  
    if (!items.length) {
      container.innerHTML = `<p class="text-gray-500">No products in the cart.</p>`;
      return;
    }
  
    container.innerHTML = items.map(item => `
      <div class="flex items-start gap-3 py-3 border-b">
        <img src="${item.images[0]?.src}" class="w-14 h-14 object-cover rounded" />
  
        <div class="flex-1">
          <p class="text-sm font-medium">${item.name}</p>
          <p class="text-xs text-gray-500">${item.quantity} × $${item.prices.price}</p>
        </div>
  
        <button onclick="removeItem('${item.key}')" 
          class="text-gray-500 hover:text-red-600 text-lg">
          ✖
        </button>
      </div>
    `).join('');
  }
  
  // ✅ Mostrar subtotal
  function updateCartTotals(totals: any) {
    const subTotal = document.getElementById('cartSubtotal');
    if (subTotal) {
      subTotal.textContent = `$${(totals.total_price / 100).toFixed(2)}`;
    }
  }
  
  // ✅ Eliminar producto del carrito
  export async function removeItem(key: string) {
    try {
      const res = await fetch(`${CART_URL}/item/${key}`, {
        method: 'DELETE',
      });
  
      if (res.ok) fetchCart(); // Recargar carrito
    } catch (err) {
      console.error('Error eliminando producto:', err);
    }
  }
  
  // ✅ Exponer funciones al navegador
  // @ts-ignore
  window.fetchCart = fetchCart;
  // @ts-ignore
  window.removeItem = removeItem;