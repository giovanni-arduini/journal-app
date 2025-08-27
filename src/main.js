import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import MainList from "./components/MainList.vue";
import BasicModal from "./components/BasicModal.vue";
import SideTab from "./components/SideTab.vue";
import PostCard from "./components/PostCard.vue";
import TagInput from "./components/TagInput.vue";

const app = createApp(App);

app.component("TagInput", TagInput);
app.component("MainList", MainList);
app.component("SideTab", SideTab);
app.component("PostCard", PostCard);
app.component("BasicModal", BasicModal);

app.mount("#app");
