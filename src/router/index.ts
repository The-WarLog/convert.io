import allConversions from "@/components/allConversions.vue";
import MainBody from "@/components/mainBody.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainBody,
  },
  {
    path: "/all-conversions",
    name: "conversions",
    component: allConversions,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
