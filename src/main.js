import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import MainList from "./components/MainList.vue";
import BasicModal from "./components/BasicModal.vue";
import SideTab from "./components/SideTab.vue";
import PostCard from "./components/PostCard.vue";
import TagInput from "./components/TagInput.vue";
import PostDetail from "./components/PostDetail.vue";
import NewPostForm from "./components/NewPostForm.vue";
import EditPostForm from "./components/EditPostForm.vue";

const app = createApp(App);

app.component("TagInput", TagInput);
app.component("MainList", MainList);
app.component("SideTab", SideTab);
app.component("PostCard", PostCard);
app.component("BasicModal", BasicModal);
app.component("PostDetail", PostDetail);
app.component("NewPostForm", NewPostForm);
app.component("EditPostForm", EditPostForm);

app.mount("#app");
