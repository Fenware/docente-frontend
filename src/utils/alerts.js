// Libreria de alertas
import Swal from "sweetalert2/dist/sweetalert2";

export function showAlert(payload) {
  new Swal({
    icon: `${payload.type}`,
    html: `<b class="text-white">${payload.message}!</b>`,
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
  });
}

export function confirmModal(payload) {
  /*  let alert = this.$swal.mixin */
  new Swal({
    toast: false,
    position: "center",
    showConfirmButton: true,
    showDenyButton: true,
    timer: 50000,
    timerProgressBar: true,
    iconColor: "white",
    heightAuto: true,
    customClass: {
      popup: "colored-toast",
    },
    html: payload.text,
    showCancelButton: false,
    confirmButtonText: payload.confirmButtonText ? payload.confirmButtonText : `Eliminar`,
    denyButtonText: `Cancelar`,
  }).then((result) => {
    // Si le da al boton de eliminar llamo a la funcion
    if (result.isConfirmed) {
      payload.function(payload.data);
      if (payload.second_function) {
        payload.second_function();
      }
    }
  });
}
