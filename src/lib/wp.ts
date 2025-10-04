

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
           images
       } = post

       const imageSrcs = images.map((img: any) => img.src);

       return {
        id,
           name,
           price,
           regular_price,
           imageSrcs
       }
   })
   console.log(resultDetallado)
   return resultDetallado

}


export const getProductsPost = async ({perPage = 10} : {perPage?: number} ={}) => {
    const response =await fetch(`${productApiWooCommerceUrl}/?per_page=${perPage}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const resultado = await response.json();
    if (!resultado.length) throw new Error('No data found');
    
    const resultDetallado = resultado.map((post : any) =>{
        const {
            id,
            slug,
            name,
            price,
            regular_price,
            images
        } = post

        const imageSrcs = images.map((img: any) => img.src);

        return {
            id,
            slug,
            name,
            price,
            regular_price,
            imageSrcs
        }
    })
    return resultDetallado
}

const cartApiWooCommerceUrl = `${domain}/wp-json/wc/store/v1/cart`; 

export const postAddToCart = async (productId: number) => {
    const cartRes = await fetch(`${cartApiWooCommerceUrl}`);
    const cartToken = cartRes.headers.get('Cart-Token');
    if (!cartToken) throw new Error('No se pudo obtener el Cart-Token');  
    console.log('Cart-Token:', cartToken);
    
    const addRes = await fetch(`${cartApiWooCommerceUrl}/add-item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cart-Token': cartToken
    },
    body: JSON.stringify({
      id: productId,
      quantity: 1
    })
  });

  if (!addRes.ok) throw new Error('Error al agregar el producto al carrito');

  // 3. Retornar el estado actualizado del carrito
  const updatedCart = await addRes.json();
  //console.log('Carrito actualizado:' , updatedCart);
  //window.location.href = `${domain}/carrito?cartToken=${cartToken}`;
  return { cartToken, updatedCart };
}
