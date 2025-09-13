export default function agregarAlCarrito(CursosB) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
    // Verificar si ya existe por ID
    const yaExiste = carrito.some(item => item.id === CursosB.id);
    if (!yaExiste) {
      carrito.push(CursosB);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      alert(`${CursosB.nombre || CursosB.titulo} fue agregado al carrito.`);
    } else {
      alert(`${CursosB.nombre || CursosB.titulo} ya está en el carrito.`);
    }
    console.log(carrito);
  }