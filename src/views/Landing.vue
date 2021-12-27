<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <o-field label="Player Name">
          <o-input type="text" v-model="playerName"> </o-input>
        </o-field>
      </section>
      <footer class="modal-card-foot">
        <o-button size="medium" variant="primary" @click="newGame()">
          Create
        </o-button>
        <o-button size="medium" variant="primary" @click="joinGame()">
          Join
        </o-button>
      </footer>
    </div>
  </form>
</template>

<script>
import * as axios from "axios";
import JoinModal from "../components/JoinModal.vue";

export default {
  data() {
    return {
      playerName: ""
    }
  },
  methods: {
    newGame() {
      axios
        .get("http://localhost:8080/api/newgame")
        .then((response) => {
          this.goToGame(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    joinGame() {
      this.$oruga.modal.open({
        parent: this,
        component: JoinModal,
        trapFocus: true,
        events: {
          "game-id": this.goToGame, // bind to event
        },
      });
    },
    goToGame(id) {
      this.$router.push({
        name: "lobby",
        params: { playerName: this.playerName, id: id },
      });
    }
  },
};
</script>
<style scoped>
</style>