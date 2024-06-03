<template>
  <div>
    <div class="control-panel">
      <p v-if="isCurrentPlayer()">Your turn ({{ store.playerColor }})</p>
      <p v-else>Current player: {{ store.model.currentPlayer }}</p>
      <p>Phase: {{ store.model.phase }}</p>
      <p v-if="store.model.phase == 'DRAFT' || store.model.phase == 'ALLDRAFT'">
        Units to place: {{ store.model.unitsToPlace }}
      </p>
      <p v-if="store.model.error != null">Error: {{ store.model.error }}</p>
      <o-button
        v-if="isCurrentPlayer()"
        size="medium"
        variant="primary"
        @click="endTurn()"
      >
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
import { useProgrammatic } from "@oruga-ui/oruga-next";
import { useRoute } from "vue-router";

const { oruga } = useProgrammatic();
const route = useRoute();
const store = useGameStore();

function isCurrentPlayer() {
  return store.playerName == store.model.currentPlayer;
}

const clicked = (territory) => {
  if (!isCurrentPlayer()) {
    console.log("Not your turn!");
    return;
  }
  switch (store.model.phase) {
    case "DRAFT":
    case "ALLDRAFT":
      sendDraft(route.params.id, store.playerName, territory.name);
      break;
    case "ATTACK":
      attack(territory);
      break;
    case "MOVE":
      modal(store.model.modal);
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
    sendAttack(route.params.id, store.playerName, store.lastSelected.name, territory.name);
    store.lastSelected = null;
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
        props: {
          label: "Fortify",
          min: 0,
          max: 100
        },
        trapFocus: true,
        events: {
          "move-units": (units) =>
            fortifyWithUnits(store.playerName, store.lastSelected.name, territory.name, units),
        },
      });
    }
  } else if (territory.player.name == currentPlayer) {
    store.lastSelected = territory;
  }
};

const fortifyWithUnits = (player, from, to, units) => {
  const fortify_data = {
    requestingPlayer: player,
    from: from,
    to: to,
    units: units,
  };
  store.lastSelected = null;
  axiosClient
    .post("/api/games/" + route.params.id + "/turn/fortify", fortify_data)
    .then((response) => {
      if (response.data.error != null) {
        store.model.error = response.data.error;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const move = (unitsToMove) => {
  const currentPlayer = store.model.currentPlayer;
  sendMove(route.params.id, currentPlayer, unitsToMove)
    .then((response) => {
      if (response.data.error != null) {
        store.model.error = response.data.error;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const modal = (modalVM) => {
  oruga.modal.open({
    component: MoveModal,
    props: {
      label: modalVM.message,
      min: modalVM.min,
      max: modalVM.max
    },
    trapFocus: true,
    events: {
      "move-units": move,
    },
  });
};

const endTurn = () => {
  axiosClient
    .post("/api/games/" + route.params.id + "/turn/end", { requestingPlayer: store.playerName })
    .catch((error) => {
      console.log(error);
    });
};

const pollGame = () => {
  console.log("poll");
  console.log(store.actionCount);
  axiosClient
    .get("/api/games/" + route.params.id + "/game/" + store.actionCount)
    .then((response) => {
      const vm = response.data;
      if (store.actionCount != vm.actionCount) {
        // something has changed
        store.model = vm.model;
        store.actionCount = vm.actionCount;
        // trigger the move modal if in the move phase
        if (store.model.phase == "MOVE" && isCurrentPlayer()) {
          modal(store.model.modal);
        }
      }
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
  /* margin-top: 60px; */
}
.control-panel {
  float: left;
}
.map-container {
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
.map {
  width: 100%;
}
</style>
