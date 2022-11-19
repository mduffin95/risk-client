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
import JoinModal from "../components/JoinModal.vue";
import { axiosClient } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { useRouter } from 'vue-router';
import { useProgrammatic } from '@oruga-ui/oruga-next'

const { oruga } = useProgrammatic();
const router = useRouter();
const store = useGameStore();

const newGame = () => {
  axiosClient
    .post("/api/games")
    .then((response) => {
      goToGame(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const joinGame = () => {
  oruga.modal.open({
    component: JoinModal,
    trapFocus: true,
    events: {
      "game-id": goToGame, // bind to event
    },
  });
};

const goToGame = (id) => {
  console.log(
    "go to game: " + id + " with player name " + store.playerName
  );
  // write to store
  // store.id = id;
  axiosClient
    .put("/api/games/" + id + "/players/" + store.playerName)
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

</script>

<style scoped>
</style>