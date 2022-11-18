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
import axios from "axios";
import TokenMarker from "../components/TokenMarker.vue";
import MoveModal from "../components/MoveModal.vue";
import { getUrl } from "../utils";
import { useGameStore } from "@/stores/GameStore";
import { onMounted } from "vue";
// import { useRouter } from "vue-router";
import { useProgrammatic } from '@oruga-ui/oruga-next'
import { useRoute } from 'vue-router'

// const router = useRouter();
const { oruga } = useProgrammatic();

const route = useRoute();
console.log("route");
console.log(route.params)

const store = useGameStore();
store.actionCount = 0;

// store.lastSelected = null;
// const lastSelected = null;
// store.gameModel = {};

const clicked = (territory) => {
  switch (store.model.phase) {
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
      console.log("No phase for " + store.model.phase);
  }
};

const draft = (territory) => {
  const draft_data = {
    territory: territory.name,
  }
  axios
    .post(getUrl() + "/api/games/" + route.params.id + "/turn/draft", draft_data)
    .catch((error) => {
      console.log(error);
    });
};

const attack = (territory) => {
  const currentPlayer = store.model.currentPlayer;
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
      .post(getUrl() + "/api/games/" + route.params.id + "/turn/attack", attack_data)
      .catch((error) => {
        console.log(error);
      });
    store.lastSelected = null;
    if (store.model.phase == "MOVE") {
      store.modal();
    }
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
    .post(getUrl() + "/api/games/" + route.params.id + "/turn/fortify", fortify_data)
    .then((response) => {
      store.model = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const move = (unitsToMove) => {
  // store.moveModalActive = true;
  console.log(unitsToMove);

  axios
    .post(getUrl() + "/api/games/" + route.params.id + "/turn/move", {
      units: unitsToMove,
    })
    .then((response) => {
      store.model = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const modal = () => {
  // const modal = MoveModal
  oruga.modal.open({
    component: MoveModal,
    trapFocus: true,
    events: {
      "move-units": move,
    },
  });
};

const endTurn = () => {
  axios.post(getUrl() + "/api/games/" + route.params.id + "/turn/end").catch((error) => {
    console.log(error);
  });
};

const pollGame = () => {
  console.log("poll")
  console.log(store.actionCount)
  axios
    .get(getUrl() + "/api/games/" + route.params.id + "/game/" + store.actionCount)
    .then((response) => {
      // TODO: Remove duplication
      const vm = response.data;
      store.model = vm.model;
      store.actionCount = vm.actionCount;
      console.log(vm);
      // console.log(store.GameStore);
      pollGame();
    });
    // .catch((error) => {
    //   // console.log(error);
    // });
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
