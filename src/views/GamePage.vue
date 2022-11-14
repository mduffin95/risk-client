<template>
  <div>
    <div>
      <p v-if="store.GameStore.playerName == gameModel.currentPlayer">
        Your turn
      </p>
      <p v-else>Current player: {{ gameModel.currentPlayer }}</p>
      <p>Phase: {{ gameModel.phase }}</p>
      <p v-if="gameModel.phase == 'DRAFT' || gameModel.phase == 'ALLDRAFT'">
        Units to place: {{ gameModel.unitsToPlace }}
      </p>
      <p v-if="gameModel.error != null">Error: {{ gameModel.error }}</p>
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
        v-for="(territory, index) in gameModel.territories"
        :key="'marker-' + index"
        :territory="territory"
        @click="clicked(territory)"
        :selected="territory.name === lastSelected?.name"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import TokenMarker from "../components/TokenMarker.vue";
import MoveModal from "../components/MoveModal.vue";
import { getUrl } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { onMounted } from "vue";
// import { useRouter } from "vue-router";
import { useProgrammatic } from '@oruga-ui/oruga-next'

// const router = useRouter();
const { oruga } = useProgrammatic();
const store = useGameStore();

store.lastSelected = null;
// const lastSelected = null;
store.gameModel = {};

const clicked = (territory) => {
  switch (store.gameModel.phase) {
    case "DRAFT":
    case "ALLDRAFT":
      draft(territory);
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
      console.log("No phase for " + store.gameModel.phase);
  }
};

const draft = (territory) => {
  const draft_data = {
    territory: territory.name,
  };
  axios
    .post(getUrl() + "/api/" + store.id + "/draft", draft_data)
    .catch((error) => {
      console.log(error);
    });
};

const attack = (territory) => {
  const currentPlayer = store.gameModel.currentPlayer;
  if (
    store.lastSelected != null &&
    store.lastSelected.player.name == currentPlayer &&
    territory.player.name != currentPlayer
  ) {
    console.log("ATTACK");
    const attack_data = {
      from: store.lastSelected.name,
      to: territory.name,
    };
    axios
      .post(getUrl() + "/api/" + store.id + "/attack", attack_data)
      .catch((error) => {
        console.log(error);
      });
    store.lastSelected = null;
    if (store.gameModel.phase == "MOVE") {
      store.modal();
    }
  } else if (territory.player.name == currentPlayer) {
    store.lastSelected = territory;
  }
};

const fortify = (territory) => {
  const currentPlayer = store.gameModel.currentPlayer;
  if (
    store.lastSelected != null &&
    store.lastSelected.player.name == currentPlayer &&
    territory.player.name == currentPlayer
  ) {
    oruga.modal.open({
      component: MoveModal,
      trapFocus: true,
      events: {
        "move-units": (units) =>
          fortifyWithUnits(store.lastSelected.name, territory.name, units),
      },
    });
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
  axios
    .post(getUrl() + "/api/" + store.id + "/fortify", fortify_data)
    .then((response) => {
      store.gameModel = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const move = (unitsToMove) => {
  // store.moveModalActive = true;
  console.log(unitsToMove);

  axios
    .post(getUrl() + "/api/" + store.id + "/move", {
      units: unitsToMove,
    })
    .then((response) => {
      store.gameModel = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const modal = () => {
  // const modal = MoveModal
  store.$oruga.modal.open({
    component: MoveModal,
    trapFocus: true,
    events: {
      "move-units": move,
    },
  });
};

const endTurn = () => {
  axios.get(getUrl() + "/api/" + store.id + "/end").catch((error) => {
    console.log(error);
  });
};

const pollGame = () => {
  axios
    .post(getUrl() + "/api/" + store.id + "/game", {
      actionCount: store.actionCount,
    })
    .then((response) => {
      // TODO: Remove duplication
      const vm = response.data;
      store.gameModel = vm.model;
      store.actionCount = vm.actionCount;
      console.log(vm);
      console.log(store.GameStore);
      store.pollGame();
    })
    .catch((error) => {
      console.log(error);
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
