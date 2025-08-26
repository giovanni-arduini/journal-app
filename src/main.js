import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import MainList from "./MainList.vue";
import BasicModal from "./BasicModal.vue";
import SideTab from "./SideTab.vue";

const app = createApp(App);

app.component("MainList", MainList);
app.component("BasicModal", BasicModal);
app.component("SideTab", SideTab);

app.mount("#app");
