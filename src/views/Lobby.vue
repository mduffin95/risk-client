<template>
  <o-button size="medium" variant="primary" @click="newGame()">
    New Game
  </o-button>
</template>

<script>
import * as axios from "axios";

export default {
  methods: {
    newGame() {
      axios
        .get("http://localhost:8080/api/newgame")
        .then((response) => {
          console.log(response.data);
          const id = response.data;

          this.$router.push({
            name: "game",
            params: { id: id }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
</style>