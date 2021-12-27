<template>
  <div>{{ id }}</div>
  <div v-for="(player, index) in model.players" :key="'player-' + index">
    {{ player }}
  </div>
  <o-button size="medium" variant="primary" @click="statGame()">
    Start
  </o-button>
</template>

<script>
import * as axios from "axios";

export default {
  data() {
    return {
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
      .get("http://localhost:8080/api/" + this.id + "/start")
      .then((response) => {
        console.log(response.data);
        this.model = response.data;
        this.$router.push({ name: "game" , params: { id: this.id }});
      })
      .catch((error) => {
        console.log(error);
      });
    },
  },
  mounted() {
    axios
      .post("http://localhost:8080/api/" + this.id + "/join", { player: this.playerName })
      .then((response) => {
        console.log(response.data);
        this.model = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
<style scoped>
</style>