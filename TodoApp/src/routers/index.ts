import { createRouter, createWebHistory } from "vue-router";
import ClientsPage from "@/pages/ClientsPage.vue";
import TodoPage from "@/pages/TodoPage.vue";

const routes = [
  { path: "/", component: ClientsPage },
  { path: "/todo", component: TodoPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
