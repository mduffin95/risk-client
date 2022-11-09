<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <o-field label="Player Name">
          <o-input type="text" v-model="store.playerName"> </o-input>
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
import axios from "axios";
import JoinModal from "../components/JoinModal.vue";
import { getUrl } from "../utils";
import store from "../store";
// import { useProgrammatic } from "@oruga-ui/oruga-next";
// import ModalForm from "./_modal-form-async.vue";

export default {
  data() {
    return {
      store,
    };
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
        // parent: this,
        component: JoinModal,
        trapFocus: true,
        events: {
          "game-id": this.goToGame, // bind to event
        },
      });
    },
    goToGame(id) {
      console.log("go to game: " + id + " with player name " + store.playerName);
      axios
        .post(getUrl() + "/api/" + id + "/join", {
          player: store.playerName,
        })
        .then(() =>
          this.$router.push({
            name: "LOBBY",
            params: { id: id },
          })
        )
        .catch((error) => {
          console.log(error);
        });
    },
    pollGame() {
      axios
        .post(getUrl() + "/api/" + this.id + "/game", {
          actionCount: this.actionCount,
        })
        .then((response) => {
          const vm = response.data;
          this.model = vm.model;
          this.actionCount = vm.actionCount;
          console.log(vm);
          const screen = vm.screen;
          if (screen == "GAME") {
            console.log("transitioning to game");
            this.$router.push({
              name: this.model.screen,
              params: { id: this.id },
            });
          } else {
            this.pollGame();
          }
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