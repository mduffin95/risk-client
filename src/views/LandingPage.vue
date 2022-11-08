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
import { getUrl } from '../utils';

export default {
  data() {
    return {
      playerName: ""
    }
  },
  methods: {
    newGame() {
      axios
        .get(getUrl() + "/api/newgame")
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
        name: "LOBBY",
        params: { playerName: this.playerName, id: id },
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
            console.log('transitioning to game')
            this.$router.push({ name: this.model.screen , params: { id: this.id }});
          } else {
            this.pollGame();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
</script>
<style scoped>
</style>