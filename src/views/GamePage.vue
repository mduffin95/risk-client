<template>
  <div>
    <div>
      <p v-if="store.playerName == store.model.currentPlayer">
        Your turn
      </p>
      <p v-else>Current player: {{ store.model.currentPlayer }}</p>
      <p>Phase: {{ store.model.phase }}</p>
      <p v-if="store.model.phase == 'DRAFT' || store.model.phase == 'ALLDRAFT'">
        Units to place: {{ store.model.unitsToPlace }}
      </p>
      <p v-if="store.model.error != null">Error: {{ store.model.error }}</p>
      <o-button size="medium" variant="primary" @click="endTurn()">
        End Turn
      </o-button>
    </div>
    <div class="map-container">
      <img
        class="map"
        alt="Risk board"
        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Risk_board.svg"
      />

      <TokenMarker
        v-for="(territory, index) in store.model.territories"
        :key="'marker-' + index"
        :territory="territory"
        @click="clicked(territory)"
        :selected="territory.name === store.lastSelected?.name"
      />
    </div>
  </div>
</template>

<script setup>
import TokenMarker from "../components/TokenMarker.vue";
import MoveModal from "../components/MoveModal.vue";
import { axiosClient, sendDraft, sendAttack, sendMove } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { onMounted } from "vue";
import { useProgrammatic } from '@oruga-ui/oruga-next'
import { useRoute } from 'vue-router'

const { oruga } = useProgrammatic();
const route = useRoute();
const store = useGameStore();

const clicked = (territory) => {
  switch (store.model.phase) {
    case "DRAFT":
    case "ALLDRAFT":
      sendDraft(route.params.id, territory.name);
      break;
    case "ATTACK":
      attack(territory);
      break;
    case "MOVE":
      modal();
      break;
    case "FORTIFY":
      fortify(territory);
      break;
    default:
      console.log("No phase for " + store.model.phase);
  }
};

const attack = (territory) => {
  const currentPlayer = store.model.currentPlayer;
  if (
    store.lastSelected != null &&
    store.lastSelected.player.name == currentPlayer &&
    territory.player.name != currentPlayer
  ) {
    sendAttack(route.params.id, store.lastSelected.name, territory.name);
    store.lastSelected = null;
    // if (store.model.phase == "MOVE") {
    //   modal();
    // }
  } else if (territory.player.name == currentPlayer) {
    store.lastSelected = territory;
  }
};

const fortify = (territory) => {
  const currentPlayer = store.model.currentPlayer;
  if (
    store.lastSelected != null &&
    store.lastSelected.player.name == currentPlayer &&
    territory.player.name == currentPlayer
  ) {
    if (territory.name == store.lastSelected.name) {
      // de-select
      store.lastSelected = null;
    } else {
      oruga.modal.open({
        component: MoveModal,
        trapFocus: true,
        events: {
          "move-units": (units) =>
            fortifyWithUnits(store.lastSelected.name, territory.name, units),
        },
      });
    }
  } else if (territory.player.name == currentPlayer) {
    store.lastSelected = territory;
  }
};

const fortifyWithUnits = (from, to, units) => {
  const fortify_data = {
    from: from,
    to: to,
    units: units,
  };
  store.lastSelected = null;
  axiosClient
    .post("/api/games/" + route.params.id + "/turn/fortify", fortify_data)
    .then((response) => {
      store.model = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const move = (unitsToMove) => {
  sendMove(route.params.id, unitsToMove)
    .then((response) => {
      store.model = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const modal = () => {
  oruga.modal.open({
    component: MoveModal,
    trapFocus: true,
    events: {
      "move-units": move,
    },
  });
};

const endTurn = () => {
  axiosClient.post("/api/games/" + route.params.id + "/turn/end").catch((error) => {
    console.log(error);
  });
};

const pollGame = () => {
  console.log("poll")
  console.log(store.actionCount)
  axiosClient
    .get("/api/games/" + route.params.id + "/game/" + store.actionCount)
    .then((response) => {
      const vm = response.data;
      store.model = vm.model;
      store.actionCount = vm.actionCount;
      console.log(vm);
      pollGame();
    });
};
onMounted(() => {
  pollGame();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.map-container {
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
.map {
  width: 100%;
}
</style>
