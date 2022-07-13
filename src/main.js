import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import "./main.scss";

const app = createApp(App);
app.use(VueAxios, axios);
app.mount("#app");
