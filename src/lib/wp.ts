

const domain = import.meta.env.WP_DOMAIN
const consumerKey = import.meta.env.CONSUMER_KEY
const consumerSecret = import.meta.env.CONSUMER_SECRET

const productApiWooCommerceUrl = `${domain}/wp-json/wc/v3/products`;

export const getPostInfo = async (slug: string) => {
   const response = await fetch(`${productApiWooCommerceUrl}?slug=${slug}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
   if (!response.ok) throw new Error('Failed to fetch products');
    
   const resultado = await response.json();
   if (!resultado.length) throw new Error('No data found');
   
   const resultDetallado = resultado.map((post : any) =>{
       const {
           id,
           name,
           price,
           regular_price,
           description,
           short_description,
           images,
           attributes
       } = post

       const imageSrcs = images.map((img: any) => img.src);
       const attributeDetails = attributes.map((attr: any) =>  attr.options[0]);
       return {
        id,
           name,
           price,
           regular_price,
           description,
           short_description,
           imageSrcs,
           attributeDetails}
   })
   return resultDetallado
   
}


export const getProductsPost = async ({ perPage = 10, page = 1 }: { perPage?: number; page?: number } = {}) => {
  const response = await fetch(`${productApiWooCommerceUrl}?per_page=${perPage}&page=${page}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
  if (!response.ok) throw new Error("Failed to fetch products");

  const resultado = await response.json();
  if (!resultado.length) throw new Error("No data found");

  const resultDetallado = resultado.map((post: any) => {
    const { id, slug, name, price, regular_price, images, categories } = post;
    const imageSrcs = images.map((img: any) => img.src);
    const categoryName = categories.map((cat: any) => cat.name)[0];

    return { id, slug, name, price, regular_price, imageSrcs, categoryName };
  });

  // 🔥 ORDENAR: “Trading” primero, luego lo demás
  resultDetallado.sort((a: any, b: any) => {
    const isATrading = a.categoryName?.toLowerCase() === "trading";
    const isBTrading = b.categoryName?.toLowerCase() === "trading";

    if (isATrading && !isBTrading) return -1;
    if (!isATrading && isBTrading) return 1;
    return 0;
  });

  return resultDetallado;
};


// ✅ Nueva función para obtener todos los productos sin paginación
export const getAllProducts = async () => {
  const perPage = 100;
  let page = 1;
  let allProducts: any[] = [];
  let batch: any[] = [];

  do {
    batch = await getProductsPost({ perPage, page });
    allProducts = allProducts.concat(batch);
    page++;
  } while (batch.length === perPage);

  return allProducts;
};

// api for categories the products
export const getProductCategories = async () => {
  const response = await fetch(`${productApiWooCommerceUrl}/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);

  if (!response.ok) throw new Error("Failed to fetch product categories");
  const categories = await response.json();
  if (!categories.length) throw new Error("No categories found");
  const resultCategories = categories.map((category: any) => {
    const { id, name, slug } = category;
    return { id, name, slug };
  })
  return resultCategories;
}

// agregar al carrito con manejo de nonce
export const postAddToCart = async (productId: number) => {
  // 🔹 Función interna para obtener un nonce fresco
  const getFreshNonce = async (): Promise<string> => {
    const nonceRes = await fetch('https://vip.bovedadecursos2025.com/wp-json/custom/v1/nonce', {
      credentials: 'include',
    });
    const { nonce } = await nonceRes.json();
    return nonce;
  };

  // 1️⃣ Obtener nonce inicial
  let nonce = await getFreshNonce();

  // 2️⃣ Intentar agregar producto con manejo automático de nonce
  const tryAddToCart = async (nonceValue: string): Promise<any> => {
    const addRes = await fetch('https://vip.bovedadecursos2025.com/wp-json/wc/store/v1/cart/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Nonce': nonceValue,
      },
      credentials: 'include',
      body: JSON.stringify({
        id: productId,
        quantity: 1,
      }),
    });

    const debugBody = await addRes.clone().text();
    console.log("🧾 ADD TO CART STATUS:", addRes.status);
    console.log("🧾 RAW BODY:", debugBody);

    // ⚠️ Si el nonce está vencido, renovarlo y reintentar
    if (addRes.status === 403 && debugBody.includes("woocommerce_rest_invalid_nonce")) {
      console.warn("⚠️ Nonce inválido, solicitando uno nuevo...");
      const newNonce = await getFreshNonce();
      return await tryAddToCart(newNonce); // 👈 llamada recursiva segura
    }

    if (!addRes.ok) {
      throw new Error(`Error al agregar al carrito (${addRes.status}): ${debugBody}`);
    }

    return await addRes.json(); // ✅ devuelve el carrito actualizado
  };

  // 3️⃣ Ejecutar intento
  return await tryAddToCart(nonce);
};
  
  export const getCart = async () => {
    const response = await fetch('https://vip.bovedadecursos2025.com/wp-json/wc/store/v1/cart', {
      credentials: 'include' // 🔹 Para enviar la cookie WC_CART_HASH y WC_SESSION
    });
  
    if (!response.ok) throw new Error('Failed to fetch cart');
  
    const cart = await response.json();
  
    console.log('CART FULL RESPONSE:', cart); // <-- Aquí verás items, totals, etc.
  
    const resultadoCart = cart.items.map((item: any) => {
      const { key, id, name, quantity, images } = item;
      const imageSrc = images?.[0]?.src || '';
      return { key, id, name, quantity, imageSrc };
    });
  
    console.log('CART ITEMS:', resultadoCart);
    return resultadoCart;
  };


// eliminar item del carrito con manejo de nonce
export const deleteCartItem = async (cartItemKey: string) => {
  // 🔹 Función interna para obtener un nonce fresco
  const getFreshNonce = async (): Promise<string> => {
    const nonceRes = await fetch('https://vip.bovedadecursos2025.com/wp-json/custom/v1/nonce', {
      credentials: 'include',
    });
    const { nonce } = await nonceRes.json();
    return nonce;
  };

  // 1️⃣ Obtener nonce inicial
  let nonce = await getFreshNonce();

  // 2️⃣ Intentar eliminar item con manejo automático de nonce
  const tryDeleteItem = async (nonceValue: string): Promise<any> => {
    const deleteRes = await fetch(`https://vip.bovedadecursos2025.com/wp-json/wc/store/v1/cart/remove-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Nonce': nonceValue,
      },
      credentials: 'include',
      body: JSON.stringify({
        key: cartItemKey,
      }),
    });

    const debugBody = await deleteRes.clone().text();
    console.log("🧾 DELETE CART ITEM STATUS:", deleteRes.status);
    console.log("🧾 RAW BODY:", debugBody);

    // ⚠️ Si el nonce está vencido, renovarlo y reintentar
    if (deleteRes.status === 403 && debugBody.includes("woocommerce_rest_invalid_nonce")) {
      console.warn("⚠️ Nonce inválido, solicitando uno nuevo...");
      const newNonce = await getFreshNonce();
      return await tryDeleteItem(newNonce); // 👈 llamada recursiva segura
    }

    if (!deleteRes.ok) {
      throw new Error(`Error al eliminar del carrito (${deleteRes.status}): ${debugBody}`);
    }

    return await deleteRes.json(); // ✅ devuelve el carrito actualizado
  };

  // 3️⃣ Ejecutar intento
  return await tryDeleteItem(nonce);
};