

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
           images
       } = post

       const imageSrcs = images.map((img: any) => img.src);

       return {
        id,
           name,
           price,
           regular_price,
           description,
           short_description,
           imageSrcs
       }
   })
   return resultDetallado

}


export const getProductsPost = async ({ perPage = 10, page = 1 }: { perPage?: number; page?: number } = {}) => {
  const response = await fetch(`${productApiWooCommerceUrl}?per_page=${perPage}&page=${page}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
  if (!response.ok) throw new Error("Failed to fetch products");

  const resultado = await response.json();
  if (!resultado.length) throw new Error("No data found");

  const resultDetallado = resultado.map((post: any) => {
    const { id, slug, name, price, regular_price, images } = post;
    const imageSrcs = images.map((img: any) => img.src);

    return { id, slug, name, price, regular_price, imageSrcs };
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


const cartApiWooCommerceUrl = `${domain}/wp-json/wc/store/v1/cart`; 

export const postAddToCart = async (productId : number) => {
    // 1️⃣ Obtener el nonce desde WordPress
    const nonceRes = await fetch('https://vip.bovedadecursos2025.com/wp-json/custom/v1/nonce', {
      credentials: 'include' // 👈 para enviar cookies
    });
  
    const { nonce } = await nonceRes.json();
    console.log('NONCE RESPONSE:', nonce);
    // 2️⃣ Hacer la petición al carrito
    const addRes = await fetch('https://vip.bovedadecursos2025.com/wp-json/wc/store/v1/cart/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Nonce': nonce,              // 👈 WooCommerce la usa aquí
      },
      credentials: 'include',        // 👈 mantiene la sesión de WooCommerce
      body: JSON.stringify({
        id: productId,
        quantity: 1
      })
    });
        console.log('ADD TO CART RESPONSE STATUS:', addRes.status);
        console.log('ADD TO CART RESPONSE HEADERS:', [...addRes.headers]);
        const debugBody = await addRes.clone().text();
        console.log('ADD TO CART RAW BODY:', debugBody);
    // 3️⃣ Manejo de error
    if (!addRes.ok) {
      const errorBody = await addRes.text();
      console.error('STATUS:', addRes.status);
      console.error('BODY:', errorBody);
      throw new Error('Error al agregar el producto al carrito');
    }
  
    // 4️⃣ Retornar carrito actualizado
    const updatedCart = await addRes.json();
    return updatedCart;
  };
  