export default function comprarAhora(curso) {
    localStorage.setItem("compraDirecta", JSON.stringify(curso));
    window.location.href = "/payment/CheckoutExpress";
}