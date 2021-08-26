// Libreria de alertas
import Swal from "sweetalert2/dist/sweetalert2";

export default function showAlert(payload) {
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
