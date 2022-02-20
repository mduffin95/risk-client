<template>
  <div>
    <div>
      <p>Current player: {{ gameModel.currentPlayer }}</p>
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

      <Marker
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
import * as axios from "axios";
import Marker from "../components/Marker.vue";
import MoveModal from "../components/MoveModal.vue";

export default {
  name: "App",
  components: {
    Marker,
  },
  props: {
    // name: String, // player name
    id: String // game ID
  },
  data() {
    return {
      gameModel: {},
      lastSelected: null,
    };
  },
  methods: {
    clicked(territory) {
      switch (this.gameModel.phase) {
        case "DRAFT":
        case "ALLDRAFT":
          this.draft(territory);
          break;
        case "ATTACK":
          this.attack(territory);
          break;
        case "MOVE":
          this.modal();
          break;
        case "FORTIFY":
          this.fortify(territory);
          break;
        default:
          console.log("No phase for " + this.gameModel.phase);
      }
    },
    draft(territory) {
      const draft_data = {
        territory: territory.name,
      };
      axios
        .post("http://localhost:8080/api/" + this.id + "/draft", draft_data)
        .catch((error) => {
          console.log(error);
        });
    },
    attack(territory) {
      const currentPlayer = this.gameModel.currentPlayer;
      if (
        this.lastSelected != null &&
        this.lastSelected.player.name == currentPlayer &&
        territory.player.name != currentPlayer
      ) {
        console.log("ATTACK");
        const attack_data = {
          from: this.lastSelected.name,
          to: territory.name,
        };
        axios
          .post("http://localhost:8080/api/" + this.id + "/attack", attack_data)
          .catch((error) => {
            console.log(error);
          });
        this.lastSelected = null;
        if (this.gameModel.phase == "MOVE") {
          this.modal();
        }
      } else if (territory.player.name == currentPlayer) {
        this.lastSelected = territory;
      }
    },
    fortify(territory) {
      const currentPlayer = this.gameModel.currentPlayer;
      if (
        this.lastSelected != null &&
        this.lastSelected.player.name == currentPlayer &&
        territory.player.name == currentPlayer
      ) {
        this.$oruga.modal.open({
          parent: this,
          component: MoveModal,
          trapFocus: true,
          events: {
            "move-units": (units) =>
              this.fortifyWithUnits(
                this.lastSelected.name,
                territory.name,
                units
              ),
          },
        });
      } else if (territory.player.name == currentPlayer) {
        this.lastSelected = territory;
      }
    },
    fortifyWithUnits(from, to, units) {
      const fortify_data = {
        from: from,
        to: to,
        units: units,
      };
      this.lastSelected = null;
      axios
        .post("http://localhost:8080/api/" + this.id + "/fortify", fortify_data)
        .then((response) => {
          this.gameModel = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    move(unitsToMove) {
      // this.moveModalActive = true;
      console.log(unitsToMove);

      axios
        .post("http://localhost:8080/api/" + this.id + "/move", {
          units: unitsToMove,
        })
        .then((response) => {
          this.gameModel = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modal() {
      // const modal = MoveModal
      this.$oruga.modal.open({
        parent: this,
        component: MoveModal,
        trapFocus: true,
        events: {
          "move-units": this.move,
        },
      });
    },
    endTurn() {
      axios
        .get("http://localhost:8080/api/" + this.id + "/end")
        .catch((error) => {
          console.log(error);
        });
    },
    pollGame() {
      axios
        .post("http://localhost:8080/api/" + this.id + "/game", { actionCount: this.actionCount })
        .then((response) => {
          // TODO: Remove duplication
          const vm = response.data;
          this.gameModel = vm.model;
          // this.actionCount = vm.actionCount
          console.log(vm)
          this.pollGame();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.pollGame();
  },
};
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
