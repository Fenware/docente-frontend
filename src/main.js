import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/assets/main.css";
import "./tailwind.css";


let alert_options = {
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  iconColor: "white",
  heightAuto: true,
  customClass: {
    popup: "colored-toast",
  }
};

createApp(App)
  .use(store)
  .use(router)
  .use(VueSweetalert2, alert_options)
  .mount("#app");