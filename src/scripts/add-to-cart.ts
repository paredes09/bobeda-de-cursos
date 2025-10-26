// src/scripts/add-to-cart.ts
import { postAddToCart, getCart } from "../lib/wp.ts";

export function setupAddToCart(buttonSelector: string) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(buttonSelector);
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.id;
      if (!productId) return;

      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = "Agregando...";

      try {
        await postAddToCart(Number(productId));
        await getCart();
        button.textContent = "✅ Agregado!";
      } catch (err) {
        console.error(err);
        button.textContent = "❌ Error";
      } finally {
        setTimeout(() => {
          button.textContent = originalText || "🛒 Agregar al carrito";
          button.disabled = false;
        }, 2000);
      }
    });
  });
}
