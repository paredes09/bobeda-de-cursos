export default function agregarAlCarrito(CursosB) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const index = carrito.findIndex(item => item.id === CursosB.id);

  if (index === -1) {
    // No existe, lo agregamos
    carrito.push(CursosB);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${CursosB.nombre || CursosB.titulo} fue agregado al carrito.`);
  } else {
    // Ya existe, verificamos si el precio cambió
    const cursoGuardado = carrito[index];
    const precioActualNuevo = parseFloat(CursosB.PrecioActual);
    const precioActualGuardado = parseFloat(cursoGuardado.PrecioActual);
    const precioAnteriorNuevo = parseFloat(CursosB.PrecioAnterior);
    const precioAnteriorGuardado = parseFloat(cursoGuardado.PrecioAnterior);
    const precioCambio =
      precioActualNuevo !== precioActualGuardado ||
      precioAnteriorNuevo !== precioAnteriorGuardado;

    if (precioCambio) {
      carrito[index].PrecioActual = CursosB.PrecioActual;
      carrito[index].PrecioAnterior = CursosB.PrecioAnterior;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      alert(`${CursosB.nombre || CursosB.titulo} ya estaba en el carrito, pero su precio fue actualizado.`);
    } else {
      alert(`${CursosB.nombre || CursosB.titulo} ya está en el carrito.`);
    }
  }
  console.log(carrito);
}