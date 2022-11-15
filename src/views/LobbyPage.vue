<template>
  <div>Game: {{ store.id }}</div>
  <div>Players: </div>
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
import axios from "axios";
import { getUrl } from '../utils'
import { useGameStore } from '@/stores/GameStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useGameStore();

const pollGame = () => {
      axios
        .post(getUrl() + "/api/" + store.id + "/game", { actionCount: store.actionCount })
        .then((response) => {
          const vm = response.data;
          store.model = vm.model;
          store.actionCount = vm.actionCount
          console.log(vm);
          const screen = vm.screen
          if (screen == 'GAME') {
            console.log('transitioning to: ' + screen)
            router.push({ name: screen , params: { id: store.id }});
          } else {
            pollGame();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

const startGame = () => {
      axios
      .get(getUrl() + "/api/" + store.id + "/start")
      .then((response) => {
        console.log(response.data);
        router.push({ name: "GAME" , params: { id: store.id }});
      })
      .catch((error) => {
        console.log(error);
      });
    };

onMounted(() => {
  pollGame();
})

</script>
<style scoped>
</style>