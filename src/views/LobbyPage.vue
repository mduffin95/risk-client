<template>
  <div>Game: {{ route.params.id }}</div>
  <div>Players:</div>
  <ul>
    <li v-for="(player, index) in store.model.players" :key="'player-' + index">
      {{ player.name }}
    </li>
  </ul>
  <o-button size="medium" variant="primary" @click="startGame()">
    Start
  </o-button>
</template>

<script setup>
import { axiosClient } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = useGameStore();

const pollGame = () => {
  axiosClient
    .get("/api/games/" + route.params.id + "/game/" + store.actionCount)
    .then((response) => {
      const vm = response.data;
      store.model = vm.model;
      store.actionCount = vm.actionCount;
      console.log(vm);
      const screen = vm.screen;
      if (screen == "GAME") {
        console.log("transitioning to: " + screen);
        router.push({ name: screen, params: { id: route.params.id } });
      } else {
        pollGame();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const startGame = () => {
  axiosClient
    .post("/api/games/" + route.params.id + "/start")
    .then((response) => {
      console.log(response.data);
      router.push({ name: "GAME", params: { id: route.params.id } });
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  pollGame();
});
</script>
<style scoped>
</style>