// src/scripts/add-to-cart.ts
import { postAddToCart } from "../lib/wp.ts";

export function setupAddToCart(buttonSelector: string) {
  const button = document.querySelector<HTMLButtonElement>(buttonSelector);
  if (!button) return;
  button.addEventListener("click", async () => {
    const productId = button.dataset.id;
    if (!productId) return;

    button.disabled = true;
    button.textContent = "Agregando...";

    try {
      await postAddToCart(Number(productId));
      button.textContent = "✅ Agregado!";
    } catch (err) {
      console.log(err);
      button.textContent = "❌ Error";
    } finally {
      setTimeout(() => {
        button.textContent = "🛒 Agregar al carrito";
        button.disabled = false;
      }, 2000);
    }
  });
}
