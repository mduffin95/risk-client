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

<script setup>
import axios from "axios";
import JoinModal from "../components/JoinModal.vue";
import { getUrl } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { useRouter } from 'vue-router';
import { useProgrammatic } from '@oruga-ui/oruga-next'
// import { ref } from "vue";
// import { mapStores } from "pinia";

// const playerName = ref("");
const oruga = useProgrammatic();
const router = useRouter();
const store = useGameStore();

const newGame = () => {
  axios
    .get(getUrl() + "/api/newgame")
    .then((response) => {
      goToGame(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const joinGame = () => {
  oruga.modal.open({
    // parent: this,
    component: JoinModal,
    trapFocus: true,
    events: {
      "game-id": goToGame, // bind to event
    },
  });
};

const goToGame = (id) => {
  // this.gameStore.playerName = this.playerName;
  console.log(
    "go to game: " + id + " with player name " + store.playerName
  );
  axios
    .post(getUrl() + "/api/" + id + "/join", {
      player: store.playerName,
    })
    .then(() =>
      router.push({
        name: "LOBBY",
        params: { id: id },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

// const pollGame = () => {
//   axios
//     .post(getUrl() + "/api/" + this.id + "/game", {
//       actionCount: this.actionCount,
//     })
//     .then((response) => {
//       const vm = response.data;
//       this.model = vm.model;
//       this.actionCount = vm.actionCount;
//       console.log(vm);
//       const screen = vm.screen;
//       if (screen == "GAME") {
//         console.log("transitioning to game");
//         this.$router.push({
//           name: this.model.screen,
//           params: { id: this.id },
//         });
//       } else {
//         pollGame();
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
</script>
<style scoped>
</style>