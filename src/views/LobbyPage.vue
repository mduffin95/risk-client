<template>
  <div>{{ id }}</div>
  <div v-for="(player, index) in model.players" :key="'player-' + index">
    {{ player.name }}
  </div>
  <o-button size="medium" variant="primary" @click="startGame()">
    Start
  </o-button>
</template>

<script>
import axios from "axios";
import { getUrl } from '../utils'

export default {
  data() {
    return {
      actionCount: 0,
      model: {},
    };
  },
  props: {
    playerName: String,
    id: String
  },
  methods: {
    startGame() {
      axios
      .get(getUrl() + "/api/" + this.id + "/start")
      .then((response) => {
        console.log(response.data);
        // this.model = response.data;
        // this.$router.push({ name: "game" , params: { id: this.id }});
      })
      .catch((error) => {
        console.log(error);
      });
    },
    pollGame() {
      axios
        .post(getUrl() + "/api/" + this.id + "/game", { actionCount: this.actionCount })
        .then((response) => {
          const vm = response.data;
          this.model = vm.model;
          this.actionCount = vm.actionCount
          console.log(vm)
          const screen = vm.screen
          if (screen == 'GAME') {
            console.log('transitioning to: ' + screen)
            this.$router.push({ name: screen , params: { id: this.id }});
          } else {
            this.pollGame();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  mounted() {
    axios
      .post(getUrl() + "/api/" + this.id + "/join", { player: this.playerName })
      .then(() => this.pollGame())
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
<style scoped>
</style>