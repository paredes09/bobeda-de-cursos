import Swal from 'sweetalert2';


export function alertaCorrecta() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Usuario Registrado Correctamente",
    showConfirmButton: false,
    timer: 2000
  }).then(() => {
    window.location.reload();
  });
}

export function alertaError() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Oops...",
    text: "Correo ya registrado",
    showConfirmButton: false,
    timer: 2000
  });
}

export function alertaLoginCorreo() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Oops...",
    text: "Correo no registrado",
    showConfirmButton: false,
    timer: 2000
  });
}

export function alertaLoginPasswoard() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Oops...",
    text: "Contraseña Incorrecta",
    showConfirmButton: false,
    timer: 2000
  });
}